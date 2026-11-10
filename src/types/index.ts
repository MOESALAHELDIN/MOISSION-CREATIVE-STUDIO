export type PhaseType = 
  | 'Start'
  | 'Discover'
  | 'Define'
  | 'Explore'
  | 'Align'
  | 'Design'
  | 'Deliver'
  | 'Close';

export type FieldOfPractice =
  | 'Brand strategy and identity'
  | 'Graphic and print design'
  | 'Art direction and photography'
  | 'Environmental and signage'
  | 'Social and campaign design'
  | 'UI/UX design'
  | 'Product and service design'
  | 'Motion and animation design'
  | 'Packaging design'
  | 'Other';

export interface DecisionRecord {
  id: string;
  sectionNumber: number;
  decisionText: string;
  owner: string;
  ownerRole: string;
  date: string;
  approved: boolean;
  notes?: string;
}

export interface PhysicalColorSpec {
  hex: string;
  name: string;
  pantone: string; // e.g. "PANTONE Black 7 C" or "PANTONE Warm Gray 1 U"
  cmyk: string;    // e.g. "C:0 M:0 Y:0 K:95"
  ral?: string;    // e.g. "RAL 9005 Tiefschwarz"
  materialSubstrate?: string; // e.g. "320gsm Gmund Cotton, Matte Anodized Aluminum"
  usageRole?: string; // e.g. "Dominant Canvas" | "Tactile Neutral" | "Structural Accent"
}

export interface DeliverableFile {
  id: string;
  sectionNumber: number;
  name: string;
  fileSize: string;
  fileType: 'pdf' | 'figma' | 'archive' | 'cad' | 'image' | 'video' | 'doc';
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  fileUrl?: string;
  status: 'draft' | 'under_review' | 'approved_for_gate';
  notes?: string;
}

export interface SectionGate {
  number: number;
  name: string;
  phase: PhaseType;
  fillIn: string;
  gateRequirement: string;
  departmentLead: string;
  status: 'pending' | 'in_progress' | 'approved' | 'blocked';
  completedDate?: string;
  approvedBy?: string;
  summary: string;
  details: {
    [key: string]: any;
  };
  deliverables?: DeliverableFile[];
}

export interface Project {
  id: string;
  title: string;
  client: string;
  clientId: string;
  fieldOfPractice: FieldOfPractice;
  coverImage: string;
  status: 'Approved' | 'Not approved';
  version: string;
  lastUpdated: string;
  approvalOwner: string; // Studio rule: Exactly one approval owner per project
  approvalOwnerRole: string;
  currentPhase: PhaseType;
  currentSection: number; // 1-12
  progressPercent: number;
  budget: string;
  depositStatus: 'Paid' | 'Pending' | 'Invoiced';
  kickoffDate: string;
  targetDeliveryDate: string;
  description: string;
  sections: SectionGate[];
  decisions: DecisionRecord[];
  deliverables?: DeliverableFile[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  team: string;
  specialty: string;
  tools: string[];
  worksOnSections: number[];
  avatar: string;
  assignedProjectsCount: number;
  status: 'available' | 'busy' | 'lead';
}

export interface Department {
  id: string;
  name: string;
  ledBy: 'Founder' | 'Managing Director' | 'Production Lead';
  leadName: string;
  leadTitle: string;
  owns: string;
  leadsSections: string;
  leadSectionNumbers: number[];
  description: string;
  teams: {
    id: string;
    name: string;
    covers: string;
    fieldsOfPractice: string[];
    memberCount: number;
  }[];
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  contactEmail: string;
  contactRole: string;
  avatar: string;
  activeProjects: string[];
  totalValue: string;
  contractStatus: 'Active' | 'Under Review' | 'Completed';
  portalAccess: boolean;
  latestGateApproved: string;
  aftercareStatus: 'Standard' | 'Retainer' | 'Onboarding';
  notes: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  isDecisionCandidate?: boolean;
  linkedSection?: number;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'project' | 'department' | 'direct';
  description?: string;
  unreadCount?: number;
  projectId?: string;
  departmentId?: string;
}
