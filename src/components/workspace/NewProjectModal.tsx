import React, { useState, useRef } from 'react';
import { Project, FieldOfPractice, TeamMember } from '../../types';
import { INITIAL_SECTIONS_TEMPLATE } from '../../data/mockData';
import { 
  X, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  FileCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
  teamMembers: TeamMember[];
}

interface IntakeSample {
  name: string;
  category: string;
  fileName: string;
  content: string;
}

const SAMPLE_INTAKES: IntakeSample[] = [
  {
    name: 'Aethelgard High-Jewelry Monograph',
    category: 'Print & Identity',
    fileName: 'Aethelgard_Client_Intake_2026.txt',
    content: `CLIENT INTAKE & CREATIVE BRIEF FORM
Organization: Aethelgard Maison de Haute Joaillerie
Project Title: Aethelgard Centennial Monograph & Heritage Identity
Engagement Type: Graphic and print design
Primary Contact: Hélène de Montmirail (Global Creative Director)
Target Budget: £92,000 GBP
Target Kickoff: 15 November 2026 | Target Completion: 28 February 2027

Objective & Scope:
Aethelgard is celebrating its centennial milestone in 2027. We require an exquisite 320-page clothbound architectural monograph, bespoke slipcase, archival foil stamping, and an updated heritage typography system for the retrospective exhibition at Grand Palais.

Key Deliverables:
1. 320-page hardcover publication with tipped-in specimen plates
2. Custom bespoke serif typeface for heritage headline engraving
3. Tri-fold exhibition guide with blind deboss on 270gsm G.F Smith Colorplan
4. Digital commemorative lookbook and video exhibition titles

Tone & Visual Direction:
Uncompromising architectural precision, warm tactile paper stocks, museum-grade layout discipline, and timeless Swiss typography with Parisian haute-joaillerie elegance.`
  },
  {
    name: 'Kallos Circular Packaging RFP',
    category: 'Packaging Craft',
    fileName: 'Kallos_Packaging_Intake_Form.txt',
    content: `MOISSION CREATIVE STUDIO - CLIENT INTAKE
Client Entity: Kallos Clean Skincare SAS
Project Name: Kallos Sculptural Pulp Packaging & Vessel System
Field of Practice: Packaging design
Client Sponsor: Dr. Sophia Aris (Co-Founder & Chief Product Officer)
Allocated Fee: £74,000
Projected Launch: Spring 2027 (approx 90 days delivery)

Project Overview:
Kallos is pioneering 100% compostable molded bamboo-pulp primary and secondary packaging for a luxury 7-piece botanical skincare routine. We need industrial form design, ergonomic snap-fit closures, unboxing ritual architecture, tactile embossing, and soy-ink structural graphics.

Deliverables:
- 3D spatial CAD tooling files for 7 unique molded pulp bottles and jars
- Custom unboxing shipper with zero glue and origami folding structure
- Production master mechanicals with Pantone spot litho specifications
- Sustainability compliance dossier and material lifecycle certification`
  },
  {
    name: 'Vespera Digital Web Platform Brief',
    category: 'UI/UX & System',
    fileName: 'Vespera_Studio_Digital_Intake.txt',
    content: `NEW CLIENT INTAKE SUMMARY
Company: Vespera Design Holding Ltd
Project Title: Vespera Spatial Architecture Digital Platform
Field: UI/UX design
Budget Allocation: £85,000
Executive Lead Required: Elena Vance
Target Delivery: 75 days

Strategic Challenge:
Vespera requires a high-performance, dark-mode digital web portal and interactive 3D spatial catalog showcasing 40+ architectural landmark commissions across Zurich, Tokyo, and London. The experience must feature fluid micro-interactions, responsive typography, and sub-second page transitions for high-net-worth real estate collectors.

Core Deliverables:
- Design system token library in Figma (Typography, elevation, motion curves)
- High-fidelity interactive prototype for web, iPad Pro, and mobile
- 3D spatial room viewer component specs for WebGL developers
- Comprehensive QA acceptance criteria and token handoff package`
  }
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  teamMembers
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [fieldOfPractice, setFieldOfPractice] = useState<FieldOfPractice>('Brand strategy and identity');
  const [approvalOwner, setApprovalOwner] = useState('Mohamed Salah');
  const [budget, setBudget] = useState('£65,000');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('/src/assets/images/moission_brand_identity_1794329379570.jpg');

  // Intake Form State
  const [isParsing, setIsParsing] = useState(false);
  const [intakeFileName, setIntakeFileName] = useState<string | null>(null);
  const [parseSuccess, setParseSuccess] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [extractedTags, setExtractedTags] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fieldsOfPractice: FieldOfPractice[] = [
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

  const studioImages = [
    { label: 'Brand & Identity Specimen', src: '/src/assets/images/moission_brand_identity_1794329379570.jpg' },
    { label: 'Spatial & Environmental Signage', src: '/src/assets/images/moission_spatial_design_1794329379123.jpg' },
    { label: 'Digital System & Minimal UI', src: '/src/assets/images/moission_digital_product_1794329379218.jpg' },
    { label: 'Tactile Packaging & Craft', src: '/src/assets/images/moission_packaging_craft_1794329379949.jpg' },
  ];

  // Helper to choose cover image based on field of practice
  const getAutoCoverImage = (field: string) => {
    if (field.includes('Packaging')) {
      return '/src/assets/images/moission_packaging_craft_1794329379949.jpg';
    } else if (field.includes('Environmental') || field.includes('Spatial') || field.includes('Signage')) {
      return '/src/assets/images/moission_spatial_design_1794329379123.jpg';
    } else if (field.includes('UI/UX') || field.includes('Product') || field.includes('Web')) {
      return '/src/assets/images/moission_digital_product_1794329379218.jpg';
    }
    return '/src/assets/images/moission_brand_identity_1794329379570.jpg';
  };

  // Process text or base64 through the backend intake endpoint
  const processIntakeData = async (payload: { fileName?: string; fileText?: string; fileBase64?: string; mimeType?: string }) => {
    setIsParsing(true);
    setParseError(null);
    setParseSuccess(false);

    try {
      const response = await fetch('/api/parse-intake-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        const d = result.data;
        if (d.title) setTitle(d.title);
        if (d.client) setClient(d.client);
        if (d.fieldOfPractice && fieldsOfPractice.includes(d.fieldOfPractice as FieldOfPractice)) {
          setFieldOfPractice(d.fieldOfPractice as FieldOfPractice);
          setCoverImage(getAutoCoverImage(d.fieldOfPractice));
        }
        if (d.approvalOwner) {
          // Verify owner exists in teamMembers
          const match = teamMembers.find(m => m.name.toLowerCase().includes(d.approvalOwner.toLowerCase()));
          if (match) {
            setApprovalOwner(match.name);
          } else {
            setApprovalOwner(d.approvalOwner);
          }
        }
        if (d.budget) setBudget(d.budget);
        if (d.description) setDescription(d.description);

        if (d.keyDeliverables && Array.isArray(d.keyDeliverables)) {
          setExtractedTags(d.keyDeliverables.slice(0, 4));
        } else {
          setExtractedTags(['Auto-extracted Scope', 'Gate 1 Ready', d.fieldOfPractice || 'Creative Brief']);
        }

        setIntakeFileName(payload.fileName || 'Client_Intake_Form.pdf');
        setParseSuccess(true);
      } else {
        throw new Error('Could not parse structured fields from intake form.');
      }
    } catch (err: any) {
      console.warn('API extraction notice:', err);
      // Client-side fallback if server endpoint is temporarily unavailable
      if (payload.fileText) {
        fallbackClientExtract(payload.fileText, payload.fileName);
      } else {
        setParseError('Unable to extract from file. Please fill fields manually.');
      }
    } finally {
      setIsParsing(false);
    }
  };

  const fallbackClientExtract = (text: string, name?: string) => {
    const clean = text.trim();
    const clientMatch = clean.match(/(?:Client|Organization|Company|Brand)[:\t ]+([^\n\r,]+)/i);
    const titleMatch = clean.match(/(?:Project Title|Project Name|Initiative)[:\t ]+([^\n\r,]+)/i);
    const budgetMatch = clean.match(/(?:Budget|Fee|Total Fee)[:\t ]*([£$€]?\s*[0-9,]+(?:\s*(?:k|gbp|usd))?)/i);
    const descMatch = clean.match(/(?:Objective|Overview|Description|Summary)[:\t ]+([^\n\r]+)/i);

    const extractedClient = clientMatch?.[1]?.trim() || (name ? name.replace(/[_-]/g, ' ').replace(/\.[a-z0-9]+$/i, '') : 'Partner Client');
    const extractedTitle = titleMatch?.[1]?.trim() || `${extractedClient} Visual Identity System`;
    const extractedBudget = budgetMatch?.[1]?.trim() || '£68,000';
    const extractedDesc = descMatch?.[1]?.trim() || clean.slice(0, 200);

    let matchedField: FieldOfPractice = 'Brand strategy and identity';
    if (/packaging|pulp|box/i.test(clean)) matchedField = 'Packaging design';
    else if (/ui\/ux|platform|interface|app/i.test(clean)) matchedField = 'UI/UX design';
    else if (/print|monograph|book|editorial/i.test(clean)) matchedField = 'Graphic and print design';

    setTitle(extractedTitle);
    setClient(extractedClient);
    setBudget(extractedBudget.startsWith('£') || extractedBudget.startsWith('$') ? extractedBudget : `£${extractedBudget}`);
    setDescription(extractedDesc);
    setFieldOfPractice(matchedField);
    setCoverImage(getAutoCoverImage(matchedField));
    setIntakeFileName(name || 'Uploaded_Intake_Document.txt');
    setExtractedTags(['Client Brief', 'Local Heuristic Extracted', matchedField]);
    setParseSuccess(true);
  };

  // Handle file upload from user
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAndProcess(file);
  };

  const readFileAndProcess = (file: File) => {
    const isText = file.type.startsWith('text/') || 
                   file.name.endsWith('.txt') || 
                   file.name.endsWith('.json') || 
                   file.name.endsWith('.md') ||
                   file.name.endsWith('.csv');

    if (isText) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        processIntakeData({
          fileName: file.name,
          fileText: text,
          mimeType: file.type || 'text/plain'
        });
      };
      reader.readAsText(file);
    } else {
      // PDF or Image: send as base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64Data = result.split(',')[1];
        processIntakeData({
          fileName: file.name,
          fileBase64: base64Data,
          mimeType: file.type || 'application/pdf'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFileAndProcess(file);
    }
  };

  // Load sample intake form
  const handleLoadSample = (sample: IntakeSample) => {
    processIntakeData({
      fileName: sample.fileName,
      fileText: sample.content,
      mimeType: 'text/plain'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) return;

    const ownerMember = teamMembers.find(m => m.name === approvalOwner);

    // Initialized sections template with fresh dates and intake details
    const freshSections = INITIAL_SECTIONS_TEMPLATE.map(s => {
      if (s.number === 1) {
        return {
          ...s,
          status: 'approved' as const,
          completedDate: '10 Nov 2026',
          approvedBy: approvalOwner,
          details: {
            ...s.details,
            clientEntity: client,
            approvalOwnerNamed: `${approvalOwner} (${ownerMember?.role || 'Lead'})`,
            kickoffDate: '10 Nov 2026',
            targetCloseDate: '15 Jan 2027',
            intakeSource: intakeFileName || undefined
          }
        };
      }
      if (s.number === 2) {
        return {
          ...s,
          details: {
            ...s.details,
            agreedFee: budget,
            exclusions: 'Third-party font licenses, physical material fabrication overruns.'
          }
        };
      }
      if (s.number === 4) {
        return {
          ...s,
          details: {
            ...s.details,
            briefOverview: description || undefined
          }
        };
      }
      return {
        ...s,
        status: 'pending' as const,
        completedDate: undefined,
        approvedBy: undefined
      };
    });

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      client: client.trim(),
      clientId: `cli-${Date.now()}`,
      fieldOfPractice,
      coverImage,
      status: 'Not approved',
      version: 'v1.0',
      lastUpdated: '10 Nov 2026',
      approvalOwner,
      approvalOwnerRole: ownerMember?.role || 'Executive Lead',
      currentPhase: 'Start',
      currentSection: 2,
      progressPercent: 8,
      budget,
      depositStatus: 'Invoiced',
      kickoffDate: '10 Nov 2026',
      targetDeliveryDate: '15 Jan 2027',
      description: description.trim() || 'New client engagement adhering to MOISSION 12-section architecture.',
      sections: freshSections,
      decisions: [
        {
          id: `dec-${Date.now()}`,
          sectionNumber: 1,
          decisionText: `Project initiated under field of practice "${fieldOfPractice}". Single approval owner confirmed as ${approvalOwner}.${intakeFileName ? ` Auto-populated from client intake form: ${intakeFileName}.` : ''}`,
          owner: approvalOwner,
          ownerRole: ownerMember?.role || 'Executive Lead',
          date: '10 Nov 2026',
          approved: true
        }
      ]
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden p-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Studio Workspace · New Project Initiation
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1 flex items-center gap-2">
              <span>Initialize 12-Section Project</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                Rule 1 & 2 Enforced
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-1 py-4 space-y-5">
          {/* Intake Form Upload & Auto-Populate Dropzone */}
          <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-900/50 p-4 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                    Client Intake Form & Brief Auto-Fill
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Upload client intake sheet (PDF, TXT, DOCX, JSON) to auto-extract and populate all fields
                  </p>
                </div>
              </div>

              {parseSuccess && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Fields Populated</span>
                </div>
              )}
            </div>

            {/* Drop Target */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                isDragOver 
                  ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-800' 
                  : 'border-neutral-300 dark:border-neutral-700/80 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-950/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.docx,.doc,.json,.md,.csv,image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {isParsing ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-600 dark:text-neutral-400" />
                  <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                    Analyzing client intake document with Gemini 3.8 Flash...
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Extracting client, project title, field of practice, fees, and deliverables...
                  </div>
                </div>
              ) : intakeFileName ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {intakeFileName}
                      </div>
                      <div className="text-[10px] text-neutral-500 flex items-center gap-2">
                        <span>Intake form processed</span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Auto-filled 6 fields</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Replace Document</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2">
                  <UploadCloud className="w-7 h-7 text-neutral-400 mb-1" />
                  <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                    <span className="underline font-semibold">Click to upload client intake form</span> or drag & drop here
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    Supports PDF, DOCX, TXT, JSON, Scanned Briefs (up to 15MB)
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sample Intakes for Instant Testing */}
            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">
                  Or load a sample client intake form to test auto-population:
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_INTAKES.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => handleLoadSample(s)}
                    disabled={isParsing}
                    className="text-left p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-all text-[11px] group disabled:opacity-50"
                  >
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white truncate">
                      {s.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate flex items-center justify-between mt-0.5">
                      <span>{s.category}</span>
                      <span className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 font-mono">
                        Auto-fill &rarr;
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Extracted Deliverable Tags Preview */}
            {extractedTags.length > 0 && (
              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Identified Scope:</span>
                {extractedTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {parseError && (
              <div className="mt-2 text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <form id="new-project-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Project Title</span>
                  {parseSuccess && <span className="text-[10px] text-emerald-500 font-mono">✨ Populated</span>}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Vespera Architectural Monograph"
                  className={`w-full px-3 py-2 text-xs rounded bg-white dark:bg-neutral-900 border text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-medium transition-colors ${
                    parseSuccess ? 'border-emerald-500/50 bg-emerald-500/[0.02]' : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Client Organization</span>
                  {parseSuccess && <span className="text-[10px] text-emerald-500 font-mono">✨ Populated</span>}
                </label>
                <input
                  type="text"
                  required
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Vespera Design Holding"
                  className={`w-full px-3 py-2 text-xs rounded bg-white dark:bg-neutral-900 border text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-medium transition-colors ${
                    parseSuccess ? 'border-emerald-500/50 bg-emerald-500/[0.02]' : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Field of Practice</span>
                  {parseSuccess && <span className="text-[10px] text-emerald-500 font-mono">✨ Detected</span>}
                </label>
                <select
                  value={fieldOfPractice}
                  onChange={(e) => {
                    const val = e.target.value as FieldOfPractice;
                    setFieldOfPractice(val);
                    setCoverImage(getAutoCoverImage(val));
                  }}
                  className={`w-full px-3 py-2 text-xs rounded bg-white dark:bg-neutral-900 border text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-medium cursor-pointer transition-colors ${
                    parseSuccess ? 'border-emerald-500/50 bg-emerald-500/[0.02]' : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  {fieldsOfPractice.map(f => (
                    <option key={f} value={f} className="dark:bg-neutral-900">
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Single Approval Owner (Rule 1)</span>
                  {parseSuccess && <span className="text-[10px] text-emerald-500 font-mono">✨ Assigned</span>}
                </label>
                <select
                  value={approvalOwner}
                  onChange={(e) => setApprovalOwner(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded bg-white dark:bg-neutral-900 border text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-medium cursor-pointer transition-colors ${
                    parseSuccess ? 'border-emerald-500/50 bg-emerald-500/[0.02]' : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.name} className="dark:bg-neutral-900">
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Contract Fee (GBP)</span>
                  {parseSuccess && <span className="text-[10px] text-emerald-500 font-mono">✨ Populated</span>}
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded bg-white dark:bg-neutral-900 border text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-mono tabular-nums transition-colors ${
                    parseSuccess ? 'border-emerald-500/50 bg-emerald-500/[0.02]' : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Cover Photo Specimen
                </label>
                <select
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-medium cursor-pointer"
                >
                  {studioImages.map(img => (
                    <option key={img.src} value={img.src} className="dark:bg-neutral-900">
                      {img.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
                <span>Brief Description & Creative Scope</span>
                {parseSuccess && <span className="text-[10px] text-emerald-500 font-mono">✨ Populated</span>}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Strategic deliverables, brand challenges, aesthetic parameters..."
                className={`w-full px-3 py-2 text-xs rounded bg-white dark:bg-neutral-900 border text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-none font-medium transition-colors ${
                  parseSuccess ? 'border-emerald-500/50 bg-emerald-500/[0.02]' : 'border-neutral-300 dark:border-neutral-700'
                }`}
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-neutral-500 hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>MOISSION Rule: 12 sections initialize with Gate 1</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="new-project-form"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Project Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
