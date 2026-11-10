import React, { useState, useEffect, useRef } from 'react';
import { 
  Project, 
  SectionGate, 
  DecisionRecord, 
  FieldOfPractice, 
  PhaseType,
  DeliverableFile,
  ChatMessage,
  PhysicalColorSpec
} from '../../types';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Save, 
  ExternalLink, 
  ChevronRight, 
  FileCheck, 
  User, 
  Calendar, 
  Lock, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Upload, 
  FileText, 
  FileCode, 
  FileArchive, 
  Image as ImageIcon, 
  Video, 
  Download, 
  Trash2, 
  Send, 
  Eye, 
  CornerDownRight, 
  LogOut,
  Palette,
  Copy,
  Check
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project;
  initialSection?: number;
  onClose: () => void;
  onUpdateProject: (updated: Project) => void;
  teamMembers: { id: string; name: string; role: string }[];
  projectMessages?: ChatMessage[];
  onSendMessage?: (channelId: string, content: string) => void;
  channelId?: string;
  onPresentProject?: (projectId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  initialSection = 1,
  onClose,
  onUpdateProject,
  teamMembers,
  projectMessages = [],
  onSendMessage,
  channelId,
  onPresentProject
}) => {
  const [activeSectionNum, setActiveSectionNum] = useState<number>(initialSection);
  const [projectState, setProjectState] = useState<Project>({ ...project });

  // In-board chat drawer state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(projectMessages);

  // Decision creation state for the active section
  const [newDecisionText, setNewDecisionText] = useState('');
  const [newDecisionOwner, setNewDecisionOwner] = useState(project.approvalOwner);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Project updated successfully');

  // Deliverables upload state
  const [isUploading, setIsUploading] = useState(false);
  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [deliverableType, setDeliverableType] = useState<DeliverableFile['fileType']>('pdf');
  const [deliverableVersion, setDeliverableVersion] = useState('v1.0');
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current active section
  const activeSection = projectState.sections.find(s => s.number === activeSectionNum) || projectState.sections[0];

  // Decisions recorded for this specific section
  const sectionDecisions = projectState.decisions.filter(d => d.sectionNumber === activeSectionNum);

  // Deliverables for this project (or section)
  const allDeliverables = projectState.deliverables || [];
  const sectionDeliverables = allDeliverables.filter(d => d.sectionNumber === activeSectionNum);

  // Physical Color state & handlers
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColorHex, setNewColorHex] = useState('#B38F5C');
  const [newColorName, setNewColorName] = useState('Raw Cast Bronze');
  const [newColorPantone, setNewColorPantone] = useState('PANTONE 871 C Metallic');
  const [newColorCmyk, setNewColorCmyk] = useState('C:20 M:30 Y:60 K:15');
  const [newColorRal, setNewColorRal] = useState('RAL 1036 Perlgold');
  const [newColorSubstrate, setNewColorSubstrate] = useState('Anodized Architectural Brushed Brass');
  const [newColorRole, setNewColorRole] = useState('Tactile Accent');

  const handleCopyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    triggerToast(`Copied ${hex} to clipboard`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleAddPhysicalColor = (e: React.FormEvent) => {
    e.preventDefault();
    const newSpec: PhysicalColorSpec = {
      hex: newColorHex.trim(),
      name: newColorName.trim(),
      pantone: newColorPantone.trim() || 'PANTONE Spot Matched',
      cmyk: newColorCmyk.trim() || 'Offset Litho Formula',
      ral: newColorRal.trim(),
      materialSubstrate: newColorSubstrate.trim() || 'Standard Studio Substrate',
      usageRole: newColorRole.trim()
    };

    const currentColors: PhysicalColorSpec[] = activeSection.details.physicalColors || [];
    const updatedColors = [...currentColors, newSpec];
    const updatedHexes = [...(activeSection.details.paletteHexes || []), newSpec.hex];

    const updatedSections = projectState.sections.map(sec => {
      if (sec.number === activeSectionNum) {
        return {
          ...sec,
          details: {
            ...sec.details,
            physicalColors: updatedColors,
            paletteHexes: updatedHexes
          }
        };
      }
      return sec;
    });

    const updated = { ...projectState, sections: updatedSections, lastUpdated: '10 Nov 2026' };
    setProjectState(updated);
    onUpdateProject(updated);
    setIsAddingColor(false);
    triggerToast(`Added physical color swatch: ${newSpec.name}`);
  };

  const handleRemovePhysicalColor = (indexToRemove: number) => {
    const currentColors: PhysicalColorSpec[] = activeSection.details.physicalColors || [];
    const updatedColors = currentColors.filter((_, idx) => idx !== indexToRemove);
    const updatedHexes = updatedColors.map(c => c.hex);

    const updatedSections = projectState.sections.map(sec => {
      if (sec.number === activeSectionNum) {
        return {
          ...sec,
          details: {
            ...sec.details,
            physicalColors: updatedColors,
            paletteHexes: updatedHexes
          }
        };
      }
      return sec;
    });

    const updated = { ...projectState, sections: updatedSections, lastUpdated: '10 Nov 2026' };
    setProjectState(updated);
    onUpdateProject(updated);
    triggerToast('Color swatch removed');
  };

  // Handle keyboard ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Sync incoming project messages
  useEffect(() => {
    setLocalMessages(projectMessages);
  }, [projectMessages]);

  // Field of practice choices
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

  // Trigger feedback toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2400);
  };

  // Handle header updates
  const handleHeaderChange = (field: keyof Project, val: any) => {
    const updated = { ...projectState, [field]: val, lastUpdated: '10 Nov 2026' };
    setProjectState(updated);
    onUpdateProject(updated);
    triggerToast('Project header updated');
  };

  // Handle section gate toggle
  const handleToggleGate = (sectionNum: number) => {
    const updatedSections = projectState.sections.map(sec => {
      if (sec.number === sectionNum) {
        const nextStatus = sec.status === 'approved' ? 'in_progress' : 'approved';
        return {
          ...sec,
          status: nextStatus as 'approved' | 'in_progress',
          completedDate: nextStatus === 'approved' ? '10 Nov 2026' : undefined,
          approvedBy: nextStatus === 'approved' ? projectState.approvalOwner : undefined
        };
      }
      return sec;
    });

    const approvedCount = updatedSections.filter(s => s.status === 'approved').length;
    const progressPercent = Math.round((approvedCount / 12) * 100);

    const firstPending = updatedSections.find(s => s.status !== 'approved');
    const currentPhase = firstPending ? firstPending.phase : 'Close';
    const currentSection = firstPending ? firstPending.number : 12;

    const updated = {
      ...projectState,
      sections: updatedSections,
      progressPercent,
      currentPhase,
      currentSection,
      lastUpdated: '10 Nov 2026'
    };

    setProjectState(updated);
    onUpdateProject(updated);
    triggerToast(activeSection.status === 'approved' ? 'Gate reopened for review' : 'Gate formally approved');
  };

  // Record a new decision at the bottom of the section
  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecisionText.trim()) return;

    const ownerMember = teamMembers.find(m => m.name === newDecisionOwner);

    const newRecord: DecisionRecord = {
      id: `dec-${Date.now()}`,
      sectionNumber: activeSectionNum,
      decisionText: newDecisionText.trim(),
      owner: newDecisionOwner,
      ownerRole: ownerMember ? ownerMember.role : 'Approval Owner',
      date: '10 Nov 2026',
      approved: true
    };

    const updatedDecisions = [...projectState.decisions, newRecord];
    const updated = {
      ...projectState,
      decisions: updatedDecisions,
      lastUpdated: '10 Nov 2026'
    };

    setProjectState(updated);
    onUpdateProject(updated);
    setNewDecisionText('');
    triggerToast('New project decision signed and bound');
  };

  // Handle Detail Field change
  const handleDetailFieldChange = (key: string, val: string) => {
    const updatedSections = projectState.sections.map(sec => {
      if (sec.number === activeSectionNum) {
        return {
          ...sec,
          details: {
            ...sec.details,
            [key]: val
          }
        };
      }
      return sec;
    });

    const updated = { ...projectState, sections: updatedSections, lastUpdated: '10 Nov 2026' };
    setProjectState(updated);
    onUpdateProject(updated);
  };

  // Deliverable Upload Handler
  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableTitle.trim()) return;

    const newFile: DeliverableFile = {
      id: `del-${Date.now()}`,
      sectionNumber: activeSectionNum,
      name: deliverableTitle.trim(),
      fileSize: `${(Math.random() * 25 + 2).toFixed(1)} MB`,
      fileType: deliverableType,
      version: deliverableVersion.trim() || 'v1.0',
      uploadedBy: projectState.approvalOwner,
      uploadedAt: '10 Nov 2026',
      status: 'under_review',
      notes: deliverableNotes.trim() || 'Uploaded for section gate evaluation.'
    };

    const updatedDeliverables = [...(projectState.deliverables || []), newFile];
    const updated = {
      ...projectState,
      deliverables: updatedDeliverables,
      lastUpdated: '10 Nov 2026'
    };

    setProjectState(updated);
    onUpdateProject(updated);
    setDeliverableTitle('');
    setDeliverableNotes('');
    setIsUploading(false);
    triggerToast(`Deliverable "${newFile.name}" added to Section ${activeSectionNum}`);
  };

  // Real or simulated file picker trigger
  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const ext = file.name.split('.').pop()?.toLowerCase();
    let type: DeliverableFile['fileType'] = 'doc';
    if (ext === 'pdf') type = 'pdf';
    else if (['fig', 'figma'].includes(ext || '')) type = 'figma';
    else if (['zip', 'tar', 'gz'].includes(ext || '')) type = 'archive';
    else if (['dxf', 'dwg', 'step'].includes(ext || '')) type = 'cad';
    else if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext || '')) type = 'image';
    else if (['mp4', 'mov', 'webm'].includes(ext || '')) type = 'video';

    const newFile: DeliverableFile = {
      id: `del-${Date.now()}`,
      sectionNumber: activeSectionNum,
      name: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: type,
      version: `v${projectState.version.replace('v', '') || '1.0'}`,
      uploadedBy: projectState.approvalOwner,
      uploadedAt: '10 Nov 2026',
      status: 'under_review',
      notes: 'Uploaded via local disk file selector.'
    };

    const updatedDeliverables = [...(projectState.deliverables || []), newFile];
    const updated = {
      ...projectState,
      deliverables: updatedDeliverables,
      lastUpdated: '10 Nov 2026'
    };

    setProjectState(updated);
    onUpdateProject(updated);
    triggerToast(`File "${file.name}" uploaded successfully`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Toggle deliverable gate status
  const handleToggleDeliverableStatus = (deliverableId: string) => {
    const updatedDeliverables = (projectState.deliverables || []).map(d => {
      if (d.id === deliverableId) {
        const nextStatus: DeliverableFile['status'] = d.status === 'approved_for_gate' ? 'under_review' : 'approved_for_gate';
        return { ...d, status: nextStatus };
      }
      return d;
    });

    const updated = {
      ...projectState,
      deliverables: updatedDeliverables,
      lastUpdated: '10 Nov 2026'
    };
    setProjectState(updated);
    onUpdateProject(updated);
    triggerToast('Deliverable verification status toggled');
  };

  // Delete deliverable
  const handleDeleteDeliverable = (deliverableId: string) => {
    const updatedDeliverables = (projectState.deliverables || []).filter(d => d.id !== deliverableId);
    const updated = {
      ...projectState,
      deliverables: updatedDeliverables,
      lastUpdated: '10 Nov 2026'
    };
    setProjectState(updated);
    onUpdateProject(updated);
    triggerToast('Deliverable removed');
  };

  // Send message from in-board chat
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: channelId || 'chan-001',
      senderId: 'mem-001',
      senderName: projectState.approvalOwner,
      senderRole: 'Approval Owner',
      senderAvatar: projectState.approvalOwner.split(' ').map(n => n[0]).join(''),
      content: chatInput.trim(),
      timestamp: '10 Nov 2026 · Just now',
      linkedSection: activeSectionNum
    };

    setLocalMessages(prev => [...prev, newMsg]);
    if (onSendMessage && channelId) {
      onSendMessage(channelId, chatInput.trim());
    }
    setChatInput('');
  };

  // Promote a chat message to a section decision right from in-board chat
  const handlePromoteMsgToDecision = (msg: ChatMessage) => {
    const newRecord: DecisionRecord = {
      id: `dec-${Date.now()}`,
      sectionNumber: activeSectionNum,
      decisionText: msg.content,
      owner: msg.senderName,
      ownerRole: msg.senderRole,
      date: '10 Nov 2026',
      approved: true
    };

    const updatedDecisions = [...projectState.decisions, newRecord];
    const updated = {
      ...projectState,
      decisions: updatedDecisions,
      lastUpdated: '10 Nov 2026'
    };

    setProjectState(updated);
    onUpdateProject(updated);
    triggerToast(`Chat consensus promoted to Section ${activeSectionNum} Decision!`);
  };

  const getFileIcon = (type: DeliverableFile['fileType']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'figma': return <FileCode className="w-4 h-4 text-purple-500" />;
      case 'archive': return <FileArchive className="w-4 h-4 text-amber-500" />;
      case 'cad': return <Layers className="w-4 h-4 text-cyan-500" />;
      case 'image': return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      case 'video': return <Video className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl max-h-[94vh] flex flex-col bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
        
        {/* -------------------------------------------------------------------------
            PROJECT HEADER: Status, Version, Owner, Live Chat Toggle & PROMINENT CLOSE BUTTON
        -------------------------------------------------------------------------- */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/70 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {projectState.client}
                </span>
                <span aria-hidden="true">·</span>
                <span>Phase: <strong className="text-neutral-800 dark:text-neutral-200">{projectState.currentPhase}</strong></span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{projectState.progressPercent}% Completed</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
                {projectState.title}
              </h1>
            </div>

            {/* Header Controls Strip */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Live Project Chat Toggle */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                  isChatOpen
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 border-transparent shadow-sm'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                }`}
                title="Open real-time in-board project chat"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Project Chat</span>
                {localMessages.length > 0 && (
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                    {localMessages.length}
                  </span>
                )}
              </button>

              {/* Status Picker */}
              <div className="flex items-center gap-1 text-xs bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">Status:</span>
                <select
                  value={projectState.status}
                  onChange={(e) => handleHeaderChange('status', e.target.value as any)}
                  className="bg-transparent font-semibold text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
                >
                  <option value="Approved" className="dark:bg-neutral-900">Approved</option>
                  <option value="Not approved" className="dark:bg-neutral-900">Not approved</option>
                </select>
              </div>

              {/* Version */}
              <div className="flex items-center gap-1 text-xs bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">Ver:</span>
                <input
                  type="text"
                  value={projectState.version}
                  onChange={(e) => handleHeaderChange('version', e.target.value)}
                  className="w-12 bg-transparent font-mono font-semibold text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              {/* Approval Owner (Rule 1) */}
              <div className="flex items-center gap-1 text-xs bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">Owner:</span>
                <select
                  value={projectState.approvalOwner}
                  onChange={(e) => handleHeaderChange('approvalOwner', e.target.value)}
                  className="bg-transparent font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer max-w-[120px] truncate"
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.name} className="dark:bg-neutral-900">
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Present Final Output Button */}
              {onPresentProject && (
                <button
                  onClick={() => onPresentProject(projectState.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-2xs"
                  title="Present final presentation and deliverables showcase"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Present Output</span>
                </button>
              )}

              {/* PROMINENT CLOSE BUTTON TO THE BOARD */}
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-200 hover:text-white bg-neutral-200/80 hover:bg-rose-600 dark:bg-neutral-800 dark:hover:bg-rose-600 rounded-md transition-all shadow-xs"
                title="Close board and return to studio (Esc)"
              >
                <X className="w-4 h-4" />
                <span>Close Board</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-black/10 dark:bg-white/10 rounded">
                  ESC
                </kbd>
              </button>
            </div>
          </div>

          {/* Subheader: Field of Practice & Updated date */}
          <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-medium">Field of Practice:</span>
              <select
                value={projectState.fieldOfPractice}
                onChange={(e) => handleHeaderChange('fieldOfPractice', e.target.value as any)}
                className="bg-white dark:bg-neutral-900 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs font-medium focus:outline-none cursor-pointer"
              >
                {fieldsOfPractice.map(f => (
                  <option key={f} value={f} className="dark:bg-neutral-900">
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-neutral-500 font-mono tabular-nums text-[11px]">
              <span>Updated: {projectState.lastUpdated}</span>
              <span>·</span>
              <span>Decisions: {projectState.decisions.length}</span>
              <span>·</span>
              <span>Deliverables: {allDeliverables.length}</span>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------------
            BODY: 12 Sections Left Navigator + Active Section Content + Optional Chat Drawer
        -------------------------------------------------------------------------- */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Left Sidebar: 12 Sections list with Phase markers & Gates */}
          <div className="w-full md:w-72 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto bg-neutral-50/50 dark:bg-neutral-950/50 p-2.5 space-y-1 shrink-0">
            <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              12 Sections · 8 Phases
            </div>

            {projectState.sections.map((section) => {
              const isActive = section.number === activeSectionNum;
              const isApproved = section.status === 'approved';
              const isInProgress = section.status === 'in_progress';
              const deliverablesCount = allDeliverables.filter(d => d.sectionNumber === section.number).length;

              return (
                <button
                  key={section.number}
                  onClick={() => setActiveSectionNum(section.number)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all text-xs flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-sm'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 ${
                    isApproved ? 'text-emerald-500' : isInProgress ? 'text-amber-500' : 'text-neutral-400'
                  }`}>
                    {isApproved ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-mono">
                        {section.number}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold truncate">
                        {section.number}. {section.name}
                      </span>
                      <span className={`text-[10px] font-mono uppercase tracking-wider shrink-0 ${
                        isActive ? 'opacity-80' : 'text-neutral-400'
                      }`}>
                        {section.phase}
                      </span>
                    </div>
                    <div className={`text-[11px] truncate mt-0.5 flex items-center justify-between ${
                      isActive ? 'opacity-80' : 'text-neutral-500'
                    }`}>
                      <span className="truncate">Gate: {section.gateRequirement}</span>
                      {deliverablesCount > 0 && (
                        <span className="font-mono text-[10px] ml-1 opacity-70">
                          {deliverablesCount} file{deliverablesCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center Main Content: Active Section Workspace Page */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-white dark:bg-neutral-950">
            
            {/* Section Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                  <span>SECTION 0{activeSection.number}</span>
                  <span aria-hidden="true">·</span>
                  <span>PHASE: {activeSection.phase.toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>LEAD: {activeSection.departmentLead}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight mt-1">
                  {activeSection.number}. {activeSection.name}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Required deliverable scope: <strong>{activeSection.fillIn}</strong>
                </p>
              </div>

              {/* Gate Sign-off Box */}
              <div className="p-3.5 rounded-lg border bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 flex items-center gap-3 shrink-0">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
                    Gate Requirement
                  </div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {activeSection.gateRequirement}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono tabular-nums">
                    Status: {activeSection.status === 'approved' ? 'Gate Passed ✓' : 'Pending Verification'}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleGate(activeSection.number)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    activeSection.status === 'approved'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200'
                  }`}
                >
                  {activeSection.status === 'approved' ? 'Gate Approved ✓' : 'Approve Gate'}
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------------------
                AREA TO UPLOAD DELIVERABLES (Files, specs, prototypes, CAD, lookbooks)
            -------------------------------------------------------------------------- */}
            <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-neutral-500" />
                    <span>Deliverables & Artifacts Vault (Section {activeSection.number})</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Upload design deliverables, prototypes, typography cuts, or signed agreements required for Gate: <strong>{activeSection.gateRequirement}</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Hidden real file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFilePicked}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File...</span>
                  </button>

                  <button
                    onClick={() => setIsUploading(!isUploading)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Deliverable Spec</span>
                  </button>
                </div>
              </div>

              {/* Upload New Deliverable Form Drawer */}
              {isUploading && (
                <form
                  onSubmit={handleAddDeliverable}
                  className="p-4 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 space-y-3 animate-in fade-in"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Register New Deliverable Artifact
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Deliverable Name / File Title
                      </label>
                      <input
                        type="text"
                        required
                        value={deliverableTitle}
                        onChange={(e) => setDeliverableTitle(e.target.value)}
                        placeholder={`e.g. Aether_Monolith_Typography_Spec_${projectState.version}.pdf`}
                        className="w-full px-3 py-1.5 text-xs rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Format
                      </label>
                      <select
                        value={deliverableType}
                        onChange={(e) => setDeliverableType(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                      >
                        <option value="pdf">PDF Document / Spec</option>
                        <option value="figma">Figma Design File (.fig)</option>
                        <option value="cad">CAD / Structural Die (.dxf / .step)</option>
                        <option value="archive">ZIP Archive Package</option>
                        <option value="image">High-Res Image / Proof</option>
                        <option value="video">Kinetic / Motion MP4</option>
                        <option value="doc">Text Specification / Contract</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      Deliverable Notes & Verification Scope
                    </label>
                    <input
                      type="text"
                      value={deliverableNotes}
                      onChange={(e) => setDeliverableNotes(e.target.value)}
                      placeholder="e.g. Countersigned brief / Passed 0.45mm die tolerance test."
                      className="w-full px-3 py-1.5 text-xs rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsUploading(false)}
                      className="px-3 py-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950"
                    >
                      Save Deliverable
                    </button>
                  </div>
                </form>
              )}

              {/* Uploaded Deliverables List for this Section */}
              <div className="space-y-2">
                {sectionDeliverables.length === 0 ? (
                  <div className="py-8 px-4 rounded border border-dashed border-neutral-300 dark:border-neutral-800 text-center text-xs text-neutral-500 space-y-1">
                    <Upload className="w-5 h-5 mx-auto text-neutral-400 opacity-60" />
                    <div className="font-medium text-neutral-700 dark:text-neutral-300">
                      No deliverables registered for Section {activeSection.number} yet.
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Upload your proof, design token library, CAD file, or research report to fulfill Gate: {activeSection.gateRequirement}.
                    </div>
                  </div>
                ) : (
                  sectionDeliverables.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 shrink-0 mt-0.5">
                          {getFileIcon(file.fileType)}
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                              {file.name}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              {file.version}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                            <span>{file.fileSize}</span>
                            <span>·</span>
                            <span>{file.uploadedBy}</span>
                            <span>·</span>
                            <span>{file.uploadedAt}</span>
                          </div>

                          {file.notes && (
                            <div className="text-[11px] text-neutral-600 dark:text-neutral-400 italic">
                              "{file.notes}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {/* Gate verification status pill */}
                        <button
                          onClick={() => handleToggleDeliverableStatus(file.id)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                            file.status === 'approved_for_gate'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                          }`}
                          title="Click to toggle gate compliance status"
                        >
                          {file.status === 'approved_for_gate' ? 'Gate Verified ✓' : 'Mark Gate Verified'}
                        </button>

                        <button
                          onClick={() => triggerToast(`Downloaded preview for "${file.name}"`)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Download deliverable file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteDeliverable(file.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Delete deliverable"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------------------
                PHYSICAL MATERIAL & COLOR SPECIFICATIONS (HEX, PANTONE, CMYK, RAL, SUBSTRATE)
            -------------------------------------------------------------------------- */}
            {(activeSection.number === 7 || activeSection.details.physicalColors || activeSection.details.paletteHexes) && (
              <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-neutral-500" />
                      <span>Physical Material & Color Specifications</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Digital Hex values mapped to physical Pantone spot inks, CMYK litho separations, architectural RAL lacquers, and tactile substrates.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingColor(!isAddingColor)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors self-start sm:self-auto shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Physical Swatch</span>
                  </button>
                </div>

                {/* Add Physical Color Form */}
                {isAddingColor && (
                  <form
                    onSubmit={handleAddPhysicalColor}
                    className="p-4 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 space-y-3 animate-in fade-in text-xs"
                  >
                    <div className="font-semibold uppercase tracking-wider text-neutral-500 text-[11px]">
                      Formulate Physical Color & Substrate Specimen
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Hex Value
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newColorHex.startsWith('#') && newColorHex.length === 7 ? newColorHex : '#000000'}
                            onChange={(e) => setNewColorHex(e.target.value.toUpperCase())}
                            className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer p-0.5 bg-transparent"
                          />
                          <input
                            type="text"
                            required
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value)}
                            placeholder="#0A0A0B"
                            className="flex-1 px-2.5 py-1.5 font-mono text-xs rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Color / Pigment Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          placeholder="e.g. Basalt Obsidian"
                          className="w-full px-2.5 py-1.5 text-xs rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Usage Role
                        </label>
                        <select
                          value={newColorRole}
                          onChange={(e) => setNewColorRole(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                        >
                          <option value="Dominant Canvas">Dominant Canvas</option>
                          <option value="Tactile Neutral">Tactile Neutral</option>
                          <option value="Structural Surface">Structural Surface</option>
                          <option value="Tactile Accent">Tactile Accent</option>
                          <option value="Secondary Foil">Secondary Foil</option>
                          <option value="Architectural Lacquer">Architectural Lacquer</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Pantone Spot Match
                        </label>
                        <input
                          type="text"
                          value={newColorPantone}
                          onChange={(e) => setNewColorPantone(e.target.value)}
                          placeholder="e.g. PANTONE Black 7 C"
                          className="w-full px-2.5 py-1.5 text-xs rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          CMYK Offset Litho
                        </label>
                        <input
                          type="text"
                          value={newColorCmyk}
                          onChange={(e) => setNewColorCmyk(e.target.value)}
                          placeholder="e.g. C:65 M:60 Y:60 K:90"
                          className="w-full px-2.5 py-1.5 text-xs rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          RAL Architectural Lacquer
                        </label>
                        <input
                          type="text"
                          value={newColorRal}
                          onChange={(e) => setNewColorRal(e.target.value)}
                          placeholder="e.g. RAL 9005 Tiefschwarz"
                          className="w-full px-2.5 py-1.5 text-xs rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Physical Material Substrate & Fabrication Spec
                      </label>
                      <input
                        type="text"
                        value={newColorSubstrate}
                        onChange={(e) => setNewColorSubstrate(e.target.value)}
                        placeholder="e.g. 320gsm Gmund Bauhaus Uncoated Paper & Blind Deboss Foil"
                        className="w-full px-2.5 py-1.5 text-xs rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingColor(false)}
                        className="px-3 py-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950"
                      >
                        Save Physical Swatch
                      </button>
                    </div>
                  </form>
                )}

                {/* Swatches Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {((activeSection.details.physicalColors as PhysicalColorSpec[]) || [
                    {
                      hex: '#0A0A0B',
                      name: 'Basalt Obsidian',
                      pantone: 'PANTONE Black 7 C',
                      cmyk: 'C:65 M:60 Y:60 K:90',
                      ral: 'RAL 9005 Tiefschwarz',
                      materialSubstrate: 'Matte Cast Resin & Blind Deboss Foil',
                      usageRole: 'Dominant Canvas'
                    },
                    {
                      hex: '#E5E2DC',
                      name: 'Unfilled Travertine',
                      pantone: 'PANTONE Warm Gray 1 C',
                      cmyk: 'C:4 M:4 Y:8 K:0',
                      ral: 'RAL 9002 Grauweiss',
                      materialSubstrate: '320gsm Gmund Bauhaus Uncoated Paper',
                      usageRole: 'Tactile Neutral'
                    },
                    {
                      hex: '#7A766F',
                      name: 'Weathered Slate',
                      pantone: 'PANTONE 7531 C',
                      cmyk: 'C:35 M:32 Y:38 K:12',
                      ral: 'RAL 7044 Seidengrau',
                      materialSubstrate: 'Acid-Etched 316 Stainless Steel Plate',
                      usageRole: 'Structural Surface'
                    },
                    {
                      hex: '#2A2926',
                      name: 'Charcoal Slag',
                      pantone: 'PANTONE 419 C',
                      cmyk: 'C:55 M:50 Y:50 K:70',
                      ral: 'RAL 7021 Schwarzgrau',
                      materialSubstrate: 'Kurz Dark Titanium Hot Stamping Foil',
                      usageRole: 'Secondary Foil'
                    }
                  ]).map((color, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3 flex flex-col justify-between shadow-2xs group"
                    >
                      <div className="space-y-2.5">
                        {/* Visual Tactile Swatch Block */}
                        <div
                          className="h-20 w-full rounded-md shadow-inner relative flex items-end p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                          style={{ backgroundColor: color.hex }}
                        >
                          {/* Sheen effect */}
                          <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />

                          <div className="relative z-10 flex items-center justify-between w-full text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white">
                            <span>{color.hex}</span>
                            <button
                              onClick={() => handleCopyHex(color.hex)}
                              className="hover:text-emerald-400 transition-colors"
                              title="Copy Hex"
                            >
                              {copiedHex === color.hex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-xs text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                            <span>{color.name}</span>
                            {color.usageRole && (
                              <span className="text-[10px] font-medium text-neutral-400">
                                {color.usageRole}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Physical Formulations Specifications */}
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] space-y-1 text-neutral-600 dark:text-neutral-400 font-mono">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">PANTONE:</span>
                            <span className="font-semibold text-neutral-900 dark:text-neutral-200">{color.pantone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">CMYK:</span>
                            <span>{color.cmyk}</span>
                          </div>
                          {color.ral && (
                            <div className="flex justify-between">
                              <span className="text-neutral-400">RAL:</span>
                              <span>{color.ral}</span>
                            </div>
                          )}
                        </div>

                        {/* Substrate */}
                        {color.materialSubstrate && (
                          <div className="text-[10px] text-neutral-500 italic pt-1 border-t border-neutral-100 dark:border-neutral-800">
                            Substrate: {color.materialSubstrate}
                          </div>
                        )}
                      </div>

                      {/* Remove Swatch button */}
                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                        <button
                          onClick={() => handleRemovePhysicalColor(idx)}
                          className="text-[10px] text-neutral-400 hover:text-rose-500 transition-colors"
                        >
                          Remove Swatch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Fill-in Workspace Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                  Deliverable Artifacts & Specifications
                </h3>
                <span className="text-xs text-neutral-400 font-mono">
                  Master Record Synced
                </span>
              </div>

              {/* Structured Fill-In Fields for this section (omitting raw color fields that are now rendered above) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(activeSection.details)
                  .filter(([key]) => key !== 'physicalColors' && key !== 'paletteHexes')
                  .map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  const isArray = Array.isArray(value);

                  return (
                    <div
                      key={key}
                      className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-2"
                    >
                      <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                        {label}
                      </label>

                      {isArray ? (
                        <div className="space-y-1.5">
                          {value.map((item: string, idx: number) => (
                            <div key={idx} className="text-xs text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={String(value)}
                          onChange={(e) => handleDetailFieldChange(key, e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-neutral-400 focus:outline-none font-medium"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Section Summary Dossier */}
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-1.5">
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Executive Section Summary
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {activeSection.summary}
                </p>
                {activeSection.completedDate && (
                  <div className="text-[11px] font-mono text-neutral-500 pt-1">
                    Gate signed on {activeSection.completedDate} by {activeSection.approvedBy || projectState.approvalOwner}
                  </div>
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------------------
                MANDATORY STUDIO RULE #3:
                "Every page ends with a decision, an owner and a date."
            -------------------------------------------------------------------------- */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Recorded Decisions for Section {activeSection.number}</span>
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Mandatory Studio Rule 3: Every page ends with a decision, an owner and a date.
                  </p>
                </div>

                <span className="text-xs font-mono tabular-nums text-neutral-400">
                  {sectionDecisions.length} Signed Decisions
                </span>
              </div>

              {/* List of existing decisions for this section */}
              <div className="space-y-2.5">
                {sectionDecisions.length === 0 ? (
                  <div className="p-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 text-center text-xs text-neutral-500">
                    No decisions recorded yet for Section {activeSection.number}. Formulate and sign the final section decision below.
                  </div>
                ) : (
                  sectionDecisions.map((dec) => (
                    <div
                      key={dec.id}
                      className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          "{dec.decisionText}"
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                          <span>Owner: {dec.owner} ({dec.ownerRole})</span>
                          <span>·</span>
                          <span>Signed: {dec.date}</span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Decision Binding</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form to record a new decision right here */}
              <form
                onSubmit={handleAddDecision}
                className="p-4 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Record New Section Decision
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={newDecisionText}
                    onChange={(e) => setNewDecisionText(e.target.value)}
                    placeholder={`e.g. Approve Section ${activeSection.number} deliverable: Direction B typography cuts locked for client presentation.`}
                    className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-none font-medium"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-neutral-500">Signing Owner:</span>
                    <select
                      value={newDecisionOwner}
                      onChange={(e) => setNewDecisionOwner(e.target.value)}
                      className="bg-white dark:bg-neutral-900 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs font-medium focus:outline-none cursor-pointer"
                    >
                      {teamMembers.map(m => (
                        <option key={m.id} value={m.name} className="dark:bg-neutral-900">
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                    <span className="text-neutral-400 font-mono text-[11px]">· Date: 10 Nov 2026</span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded transition-colors whitespace-nowrap self-end sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Sign & Record Decision</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Section Navigation Footer WITH EXPLICIT CLOSE BOARD BUTTON */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <button
                disabled={activeSectionNum <= 1}
                onClick={() => setActiveSectionNum(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 text-xs font-medium rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous Section
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">
                  Section {activeSectionNum} of 12
                </span>

                {/* BOTTOM CLOSE BOARD BUTTON */}
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded border border-neutral-300 dark:border-neutral-700 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 text-neutral-700 dark:text-neutral-300 transition-colors inline-flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close Board</span>
                </button>
              </div>

              <button
                disabled={activeSectionNum >= 12}
                onClick={() => setActiveSectionNum(prev => Math.min(12, prev + 1))}
                className="px-3 py-1.5 text-xs font-medium rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next Section →
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------------------------
              IN-BOARD LIVE PROJECT CHAT DRAWER
          -------------------------------------------------------------------------- */}
          {isChatOpen && (
            <div className="w-full md:w-80 border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between shrink-0 shadow-lg animate-in slide-in-from-right duration-200">
              
              {/* Chat Drawer Header */}
              <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Project Live Chat
                  </span>
                </div>

                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Drawer Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {localMessages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-400">
                    No messages yet in this project channel. Start the discussion below!
                  </div>
                ) : (
                  localMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="group p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 text-[11px]">
                          {msg.senderName}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          {msg.timestamp.split('·')[1] || msg.timestamp}
                        </span>
                      </div>

                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-[11px]">
                        {msg.content}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400">
                        <span>{msg.senderRole}</span>
                        {/* 1-click promote to decision */}
                        <button
                          onClick={() => handlePromoteMsgToDecision(msg)}
                          className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-0.5"
                          title="Promote message to this section's decision log"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Promote</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Chat on ${projectState.title.slice(0, 16)}...`}
                    className="flex-1 px-2.5 py-1.5 text-xs rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-1.5 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="absolute bottom-4 right-4 z-50 px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
