import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Allowed fields of practice
const VALID_FIELDS = [
  'Brand strategy and identity',
  'Graphic and print design',
  'Art direction and photography',
  'Environmental and signage',
  'Social and campaign design',
  'UI/UX design',
  'Product and service design',
  'Motion and animation design',
  'Packaging design',
  'Other'
];

interface ParseIntakeRequest {
  fileName?: string;
  fileText?: string;
  fileBase64?: string;
  mimeType?: string;
}

// Fallback heuristic parser in case Gemini API key is unavailable or offline
function heuristicParse(text: string, fileName?: string) {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // Extract client name
  let client = '';
  const clientMatch = clean.match(/(?:Client|Organization|Company|Brand|Customer|Client Name)[:\t ]+([^\n\r,]+)/i);
  if (clientMatch && clientMatch[1]) {
    client = clientMatch[1].trim();
  } else if (fileName) {
    // Try inferring from filename e.g. "Kallos_Intake_Form.pdf"
    const namePart = fileName.replace(/[_-]/g, ' ').replace(/\.(pdf|txt|docx|json|png|jpg)$/i, '').replace(/intake|form|brief|client/gi, '').trim();
    if (namePart) client = namePart;
  }

  // Extract project title
  let title = '';
  const titleMatch = clean.match(/(?:Project Title|Project Name|Initiative|Engagement|Project)[:\t ]+([^\n\r,]+)/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  } else if (client) {
    title = `${client} Visual System & Identity`;
  } else {
    title = 'New Studio Engagement';
  }

  // Field of practice
  let fieldOfPractice = 'Brand strategy and identity';
  if (lower.includes('packaging') || lower.includes('box') || lower.includes('unboxing') || lower.includes('label')) {
    fieldOfPractice = 'Packaging design';
  } else if (lower.includes('signage') || lower.includes('environmental') || lower.includes('wayfinding') || lower.includes('spatial')) {
    fieldOfPractice = 'Environmental and signage';
  } else if (lower.includes('ui/ux') || lower.includes('app') || lower.includes('interface') || lower.includes('web application') || lower.includes('saas')) {
    fieldOfPractice = 'UI/UX design';
  } else if (lower.includes('product and service') || lower.includes('service design')) {
    fieldOfPractice = 'Product and service design';
  } else if (lower.includes('motion') || lower.includes('animation') || lower.includes('video')) {
    fieldOfPractice = 'Motion and animation design';
  } else if (lower.includes('photography') || lower.includes('art direction') || lower.includes('photoshoot')) {
    fieldOfPractice = 'Art direction and photography';
  } else if (lower.includes('campaign') || lower.includes('social media')) {
    fieldOfPractice = 'Social and campaign design';
  } else if (lower.includes('print') || lower.includes('book') || lower.includes('monograph') || lower.includes('editorial')) {
    fieldOfPractice = 'Graphic and print design';
  }

  // Budget
  let budget = '£65,000';
  const budgetMatch = clean.match(/(?:Budget|Fee|Total Fee|Contract Value|Investment)[:\t ]*([£$€]?\s*[0-9,]+(?:\s*(?:k|gbp|usd|eur))?)/i);
  if (budgetMatch && budgetMatch[1]) {
    budget = budgetMatch[1].trim();
    if (!budget.startsWith('£') && !budget.startsWith('$') && !budget.startsWith('€')) {
      budget = `£${budget}`;
    }
  }

  // Description / scope
  let description = '';
  const descMatch = clean.match(/(?:Overview|Description|Scope|Objective|Summary|Goal)[:\t ]+([^\n\r]+(?:\n[^\n\r]+)?)/i);
  if (descMatch && descMatch[1]) {
    description = descMatch[1].trim();
  } else {
    description = clean.slice(0, 240);
  }

  // Approval owner recommendation
  let approvalOwner = 'Mohamed Salah';
  if (fieldOfPractice === 'Packaging design' || fieldOfPractice === 'Environmental and signage') {
    approvalOwner = 'Tariq Rahman'; // Production Lead
  } else if (fieldOfPractice === 'UI/UX design') {
    approvalOwner = 'Elena Vance';
  }

  return {
    title: title || 'Comprehensive Brand Architecture',
    client: client || 'Client Partner',
    fieldOfPractice,
    approvalOwner,
    budget,
    description: description || 'Creative studio engagement initialized from client intake document.',
    source: 'heuristic'
  };
}

// Intake form parsing endpoint
app.post('/api/parse-intake-form', async (req: Request, res: Response) => {
  try {
    const { fileName, fileText, fileBase64, mimeType } = req.body as ParseIntakeRequest;

    if (!fileText && !fileBase64) {
      return res.status(400).json({ error: 'Please provide either fileText or fileBase64 payload.' });
    }

    // If Gemini client is initialized, use gemini-3.8-flash for structured document extraction
    if (aiClient) {
      try {
        let contents: any;
        const promptInstruction = `You are the lead intake director at MOISSION Creative Studio.
Analyze the provided client intake form / RFP / brief document and extract the structured project metadata.
Valid fields of practice MUST be exactly one of:
- "Brand strategy and identity"
- "Graphic and print design"
- "Art direction and photography"
- "Environmental and signage"
- "Social and campaign design"
- "UI/UX design"
- "Product and service design"
- "Motion and animation design"
- "Packaging design"
- "Other"

Recommend one approval owner from the studio leadership:
- "Mohamed Salah" (Founder & Strategy/Creative/Digital Executive Lead)
- "Elena Vance" (Managing Director & Operations/Client Services Lead)
- "Tariq Rahman" (Production Lead & 3D/Packaging/Print Specialist)
- "Maya Lin" (Brand Systems Lead)

Budget should be formatted nicely with currency symbol (defaulting to £ GBP if unstated).
Provide a concise 1-2 sentence executive summary of the creative brief and deliverables.`;

        if (fileBase64 && mimeType) {
          contents = {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: fileBase64,
                },
              },
              {
                text: promptInstruction,
              },
            ],
          };
        } else {
          contents = `${promptInstruction}\n\nClient Intake Document Text:\n${fileText}`;
        }

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: 'Polished creative project title for the studio workspace'
                },
                client: {
                  type: Type.STRING,
                  description: 'Official client organization or business entity name'
                },
                fieldOfPractice: {
                  type: Type.STRING,
                  description: 'The single field of practice that best fits the engagement'
                },
                approvalOwner: {
                  type: Type.STRING,
                  description: 'Designated approval owner for all 12 gates'
                },
                budget: {
                  type: Type.STRING,
                  description: 'Total project fee or budget estimate formatted with currency'
                },
                description: {
                  type: Type.STRING,
                  description: 'Crisp 1-2 sentence summary of creative scope and primary objectives'
                },
                targetDeliveryDays: {
                  type: Type.INTEGER,
                  description: 'Estimated project duration in days (e.g. 60)'
                },
                keyDeliverables: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Key deliverables identified from the intake'
                }
              },
              required: ['title', 'client', 'fieldOfPractice', 'approvalOwner', 'budget', 'description']
            }
          }
        });

        const rawJson = response.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return res.json({
            success: true,
            data: {
              ...parsed,
              source: 'gemini-3.8-flash'
            }
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini extraction had an issue, falling back to local heuristic extraction:', geminiError?.message);
      }
    }

    // Fallback heuristic extraction if Gemini is unavailable or errors
    const parsedData = heuristicParse(fileText || '', fileName);
    return res.json({
      success: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error('Error parsing intake form:', error);
    return res.status(500).json({ error: error?.message || 'Failed to parse intake document' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`MOISSION Creative Studio running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
