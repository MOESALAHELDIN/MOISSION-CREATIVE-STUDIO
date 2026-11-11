import React, { useState, useEffect, useId } from 'react';
import { Project, PhysicalColorSpec, DeliverableFile, SectionGate } from '../../types';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Palette, 
  Box, 
  FileText, 
  Copy, 
  Check, 
  Clock, 
  Calendar, 
  Volume2, 
  Share2, 
  Eye, 
  Printer, 
  MessageSquareQuote,
  Building,
  Monitor
} from 'lucide-react';

interface ProjectPresentationModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkspace: (projectId: string, section?: number) => void;
}

export const ProjectPresentationModal: React.FC<ProjectPresentationModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenWorkspace
}) => {
  if (!isOpen) return null;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const totalSlides = 7;

  // Slide navigation titles
  const slideTabs = [
    { title: 'Overview & DNA', icon: Layers },
    { title: 'Strategic Voice', icon: Volume2 },
    { title: 'Visual Identity', icon: Sparkles },
    { title: 'Physical Colors & Materials', icon: Palette },
    { title: 'Multi-Medium Output', icon: Box },
    { title: '12-Gate Governance', icon: ShieldCheck },
    { title: 'Deliverables Vault', icon: Download },
  ];

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyHandoff = () => {
    const handoffSummary = `MOISSION CREATIVE STUDIO - CLIENT HANDOFF & FINAL DELIVERABLES
Project: ${project.title}
Client: ${project.client}
Field of Practice: ${project.fieldOfPractice}
Approval Owner: ${project.approvalOwner} (${project.approvalOwnerRole})
Status: ${project.status} (${project.version})
Progress: ${project.progressPercent}% across 12 Sections
Total Decisions Logged: ${project.decisions.length}
Closed-out Gates: ${project.sections.filter(s => s.status === 'approved').length}/12
Verified by MOISSION Studio Architecture`;

    navigator.clipboard.writeText(handoffSummary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Physical color specimens
  const physicalColors: PhysicalColorSpec[] = [
    {
      hex: '#0F1115',
      name: 'Architectural Obsidian Noir',
      pantone: 'PANTONE 419 C / Black 7 C',
      cmyk: 'C:0 M:0 Y:0 K:96',
      ral: 'RAL 9005 Jet Black Lacquer',
      materialSubstrate: 'G.F Smith Colorplan 350gsm Ebony, Anodized Powdercoat Aluminum',
      usageRole: 'Primary Identity Canvas & Monograph Cloth'
    },
    {
      hex: '#E8E5DD',
      name: 'Tactile Calico Warm Gray',
      pantone: 'PANTONE Warm Gray 1 C',
      cmyk: 'C:3 M:4 Y:7 K:0',
      ral: 'RAL 9002 Gray White',
      materialSubstrate: 'Fedrigoni Materica 250gsm Kraft, Unbleached Bamboo Pulp',
      usageRole: 'Unboxing Secondary Packaging & Stationery Paper'
    },
    {
      hex: '#8D8F88',
      name: 'Cast Mineral Titanium',
      pantone: 'PANTONE Cool Gray 8 C',
      cmyk: 'C:15 M:11 Y:13 K:38',
      ral: 'RAL 7037 Dusty Grey',
      materialSubstrate: 'Cast Architectural Concrete, Sandblasted Stainless Steel',
      usageRole: 'Spatial Wayfinding & Exterior Signage'
    },
    {
      hex: '#D9532F',
      name: 'Burnt Vermilion Accent',
      pantone: 'PANTONE 7597 C',
      cmyk: 'C:0 M:82 Y:88 K:5',
      ral: 'RAL 2002 Vermilion',
      materialSubstrate: 'Kurz Luxor Archival Hot Foil, Silk-Screen Spot Pigment',
      usageRole: 'Seal of Approval, Foil Spine Titling & Callout Markers'
    }
  ];

  // Presenter talking notes for each slide
  const presenterNotes = [
    [
      `Welcome ${project.client} leadership team. Today we present the finalized creative architecture for "${project.title}".`,
      `Governed under MOISSION Rule 1: Single Approval Owner ${project.approvalOwner}. All 12 gates were audited against the original brief.`,
      `Total budget invested: ${project.budget}. All deliverables conform to production mechanicals.`
    ],
    [
      `Strategy preceded all visual exploration (MOISSION Rule 2). We identified the core differentiation territory and competitor white space.`,
      `Voice tenets: Uncompromising discipline, architectural proportion, tactile honesty.`,
      `Target demographic prioritizes timeless craftsmanship over transient digital noise.`
    ],
    [
      `Visual identity features our custom typographic scale and geometry.`,
      `Letterforms are optically tuned for both large-scale architectural wayfinding and high-density screens.`,
      `Notice the negative space balance in the primary mark.`
    ],
    [
      `Crucial distinction: We deliver physical ink and substrate formulas alongside digital HEXes.`,
      `Pantone spot litho formulations prevent color shift across European offset printers.`,
      `RAL lacquers and G.F Smith stocks are locked into the production mechanical spec sheets.`
    ],
    [
      `Here is the unified output across digital interfaces, physical packaging, and spatial signage.`,
      `The unboxing ritual incorporates zero-glue origami locking tabs and bamboo-pulp vessels.`,
      `Digital platform maintains sub-second transitions with high typographic contrast.`
    ],
    [
      `Audit trail: All 12 project sections have recorded binding decisions with dates and owners (MOISSION Rule 3).`,
      `Zero lingering open feedback items or unmitigated risks.`,
      `The project record is permanent and locked for revision audit.`
    ],
    [
      `Final deliverables vault: Vector assets, Figma token design system, 3D tooling CADs, print mechanicals, and full commercial copyright deed.`,
      `We officially close out the engagement and initiate the 60-day studio aftercare warranty.`
    ]
  ];

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden bg-neutral-950 flex flex-col text-neutral-100 ${
      isFullscreen ? 'p-0' : 'p-2 sm:p-4'
    }`}>
      
      {/* -------------------------------------------------------------------------
          TOP BAR CONTROLS (Presentation Header)
      -------------------------------------------------------------------------- */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-white bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
              MOISSION
            </span>
            <span className="text-xs font-semibold text-neutral-300 hidden sm:inline">
              Executive Presentation & Output Showcase
            </span>
          </div>

          <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

          <div className="text-xs text-neutral-400 truncate max-w-xs sm:max-w-md">
            <span className="font-medium text-white">{project.title}</span>
            <span className="mx-1.5 text-neutral-600">·</span>
            <span className="text-neutral-400">{project.client}</span>
          </div>
        </div>

        {/* Right Stage Controls */}
        <div className="flex items-center gap-2">
          {/* Presentation Timer */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowPresenterNotes(prev => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              showPresenterNotes 
                ? 'bg-neutral-100 text-neutral-950 font-semibold' 
                : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Presenter Notes</span>
          </button>

          {/* Switch to 12-Section Workspace */}
          <button
            onClick={() => {
              onClose();
              onOpenWorkspace(project.id);
            }}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Workspace</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Presentation */}
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors ml-1"
            title="Close Presentation (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          SLIDE TAB SELECTOR BAR
      -------------------------------------------------------------------------- */}
      <div className="shrink-0 flex items-center gap-1 px-4 py-2 bg-neutral-950 border-b border-neutral-900 overflow-x-auto no-scrollbar">
        {slideTabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = currentSlide === idx;

          return (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-950' : 'text-neutral-500'}`} />
              <span>{idx + 1}. {tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* -------------------------------------------------------------------------
          MAIN PRESENTATION STAGE (Slide Viewport)
      -------------------------------------------------------------------------- */}
      <div className="flex-1 relative overflow-y-auto overflow-x-hidden p-4 sm:p-8 flex items-center justify-center bg-neutral-950">
        <div className="w-full max-w-6xl mx-auto min-h-[500px] flex flex-col justify-center animate-in fade-in zoom-in-95 duration-200">
          
          {/* SLIDE 1: OVERVIEW & DNA */}
          {currentSlide === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Gate 12 Closed · Final Client Presentation</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
                    {project.title}
                  </h1>
                  <div className="text-lg text-neutral-400 font-light">
                    Commissioned by <strong>{project.client}</strong>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                  {project.description}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Field of Practice</div>
                    <div className="text-xs font-semibold text-neutral-200 mt-0.5 truncate">{project.fieldOfPractice}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Single Approval Owner</div>
                    <div className="text-xs font-semibold text-neutral-200 mt-0.5">{project.approvalOwner}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Contract Investment</div>
                    <div className="text-xs font-mono font-bold text-white mt-0.5">{project.budget}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Studio Version</div>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">{project.version} (Approved)</div>
                  </div>
                </div>

                {/* Presentation Action Kicker */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentSlide(1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-neutral-950 font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-colors shadow-sm"
                  >
                    <span>Begin Strategy Walkthrough</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopyHandoff}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white font-medium text-xs transition-colors"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText ? 'Summary Copied' : 'Copy Client Briefing Sheet'}</span>
                  </button>
                </div>
              </div>

              {/* Cover Specimen Photo */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900 group">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">Specimen Plate 01</div>
                    <div className="text-sm font-bold text-white">{project.fieldOfPractice}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: STRATEGIC VOICE */}
          {currentSlide === 1 && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">Phase 2 & 3 · Discover & Define</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Strategic Foundations & Voice Architecture
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl">
                  MOISSION Rule 2: Strategy strictly precedes visuals. The following core positioning pillars govern all identity decisions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Pillar 01 · Positioning</div>
                  <h3 className="text-base font-bold text-white">Architectural Restraint</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Positioning the brand above ephemeral industry hype cycles. Grounded in timeless Swiss typography, structural geometry, and tactile material integrity.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-neutral-500">
                    Target: High-net-worth design patrons & institutions
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Pillar 02 · Voice & Tone</div>
                  <h3 className="text-base font-bold text-white">Uncompromising Precision</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Communication is authoritative, measured, and void of decorative filler. Every sentence conveys exact intention and engineering rigor.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-neutral-500">
                    Tonal Key: Editorial, Direct, Architectural
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Pillar 03 · Differentiator</div>
                  <h3 className="text-base font-bold text-white">Multi-Medium Harmony</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Seamless translation between digital reactive surfaces, 350gsm hot-stamped paper stocks, and architectural stainless steel wayfinding.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-neutral-500">
                    Physical: Litho Spot Inks + RAL Coatings
                  </div>
                </div>
              </div>

              {/* Recorded Strategy Gate Decision */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Gate 5 Passed: Strategy & Voice Approved</div>
                    <div className="text-[11px] text-neutral-400">
                      Signed off by {project.approvalOwner} ({project.approvalOwnerRole}) · 10 Nov 2026
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-neutral-500">Audit Stamp #ST-2026</span>
              </div>
            </div>
          )}

          {/* SLIDE 3: VISUAL IDENTITY */}
          {currentSlide === 2 && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">Phase 4 & 5 · Explore & Align</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Visual Identity & Typographic Architecture
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl">
                  Structural brand marks, optical kerning rules, and bespoke typographic hierarchies configured for multi-device delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Brand Symbol Display Stage */}
                <div className="lg:col-span-5 p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-center">
                  <div className="w-28 h-28 rounded-2xl border-2 border-white/20 bg-neutral-950 flex items-center justify-center shadow-2xl mb-4 group hover:border-white transition-colors">
                    <span className="font-extrabold text-4xl text-white tracking-tighter">
                      {project.title.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white tracking-tight">{project.title}</div>
                  <div className="text-xs text-neutral-400 mt-1 font-mono">{project.fieldOfPractice}</div>
                  <div className="mt-4 pt-4 border-t border-neutral-800 text-[11px] text-neutral-500">
                    Vector Master · Optical Bounds 100% Vectorized
                  </div>
                </div>

                {/* Typographic Specimen */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Typographic Specimen</span>
                    <span className="text-[11px] font-mono text-neutral-500">Plus Jakarta Sans & JetBrains Mono</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] font-mono text-neutral-500">DISPLAY TITLES · 48PT / 800 EXTRA BOLD</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Architecture of Restraint
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-neutral-500">EDITORIAL SUBHEADS · 18PT / 600 SEMI BOLD</div>
                      <div className="text-base font-semibold text-neutral-300">
                        Synthesizing tactile craft with digital responsiveness
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-neutral-500">MONOSPACE SYSTEM NUMERALS · 12PT</div>
                      <div className="text-sm font-mono text-emerald-400 tracking-wider">
                        0123456789 · RAL-9005 · C:0 M:0 Y:0 K:96 · 350GSM
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-neutral-500">BODY RUNNING TEXT · 14PT / 400 REGULAR</div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Every letterform preserves legibility when micro-etched onto anodized structural aluminum or rendered across OLED ultra-dense client viewports.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: PHYSICAL COLORS & MATERIALS */}
          {currentSlide === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">Section 7 Output · Physical Specifications</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    Physical Inks, Lacquers & Material Substrates
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                    Pairing digital HEX codes with physical manufacturing standards: Pantone Spot Inks, CMYK litho, and architectural RAL standards.
                  </p>
                </div>

                <div className="text-xs font-mono text-neutral-400">
                  Click any swatch to copy formulation
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {physicalColors.map((color) => (
                  <div
                    key={color.hex}
                    onClick={() => handleCopyHex(color.hex)}
                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Swatch visual */}
                      <div
                        className="w-full aspect-[16/9] rounded-lg mb-3 border border-white/10 shadow-inner relative overflow-hidden"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="p-1 rounded bg-black/70 text-white text-[10px] font-mono flex items-center gap-1">
                            {copiedHex === color.hex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedHex === color.hex ? 'Copied' : 'Copy'}</span>
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white truncate">{color.name}</h4>
                      <div className="font-mono text-xs text-neutral-400 font-bold mt-0.5">{color.hex}</div>

                      <div className="mt-3 space-y-1.5 text-[11px] text-neutral-400">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Pantone:</span>
                          <span className="font-mono text-neutral-200 font-semibold">{color.pantone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">CMYK Litho:</span>
                          <span className="font-mono text-neutral-200">{color.cmyk}</span>
                        </div>
                        {color.ral && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">RAL Code:</span>
                            <span className="font-mono text-neutral-200">{color.ral}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 leading-snug">
                      <span className="font-semibold text-neutral-400 block mb-0.5">Physical Substrate:</span>
                      {color.materialSubstrate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 5: MULTI-MEDIUM OUTPUT */}
          {currentSlide === 4 && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">Section 8 Output · Applications</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Multi-Medium Output & Production Applications
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl">
                  Complete design delivery spanning digital interfaces, physical packaging unboxing architecture, and environmental signage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-3">
                      <img
                        src="/images/moission_digital_product_1794329379218.jpg"
                        alt="Digital UI/UX System"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Digital Medium</span>
                    </div>
                    <h3 className="text-base font-bold text-white">Interactive Web & UI/UX</h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Fluid typography tokens, zero-layout-shift component libraries, and sub-second page rendering for global collectors.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-800 text-[11px] font-mono text-neutral-400">
                    Figma Tokens · React / WebGL Mechanicals
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-3">
                      <img
                        src="/images/moission_packaging_craft_1794329379949.jpg"
                        alt="Packaging Craft & Vessels"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
                      <Box className="w-3.5 h-3.5" />
                      <span>Packaging Medium</span>
                    </div>
                    <h3 className="text-base font-bold text-white">Tactile Vessel Packaging</h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Zero-glue molded unbleached pulp construction, origami closure mechanics, and archival hot-foil embossed branding.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-800 text-[11px] font-mono text-neutral-400">
                    3D Mold CADs · Die-Line Mechanicals
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-3">
                      <img
                        src="/images/moission_spatial_design_1794329379123.jpg"
                        alt="Spatial & Environmental Signage"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
                      <Building className="w-3.5 h-3.5" />
                      <span>Spatial Medium</span>
                    </div>
                    <h3 className="text-base font-bold text-white">Environmental Wayfinding</h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Monolithic steel monoliths, architectural directional pylons, and laser-etched stainless steel plaques.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-800 text-[11px] font-mono text-neutral-400">
                    Fabrication Vectors · Structural Blueprints
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: 12-GATE GOVERNANCE */}
          {currentSlide === 5 && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">Audit & Compliance</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  12-Section Gating Audit & Recorded Decisions
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl">
                  MOISSION Rule 3: Every page ends with a decision, an owner, and a date. Verification audit of all phases.
                </p>
              </div>

              {/* 12 Gates Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {project.sections.map((sec) => (
                  <div
                    key={sec.number}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      sec.status === 'approved'
                        ? 'bg-emerald-950/20 border-emerald-800/60 text-neutral-200'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[11px] text-neutral-400">
                        Sec {sec.number.toString().padStart(2, '0')}
                      </span>
                      {sec.status === 'approved' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-500 uppercase">Pending</span>
                      )}
                    </div>
                    <div className="font-semibold text-white truncate">{sec.name}</div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      Gate: {sec.gateRequirement}
                    </div>
                    {sec.completedDate && (
                      <div className="text-[10px] font-mono text-emerald-400/90 pt-1">
                        Signed: {sec.completedDate}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Decisions Ledger Highlights */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Permanent Decision Log ({project.decisions.length} Decisions Logged)
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {project.decisions.map((dec) => (
                    <div key={dec.id} className="text-xs flex items-start justify-between gap-4 p-2 rounded bg-neutral-950/60 border border-neutral-800/80">
                      <div>
                        <span className="font-mono text-emerald-400 mr-2">[Sec {dec.sectionNumber}]</span>
                        <span className="text-neutral-200">{dec.decisionText}</span>
                      </div>
                      <div className="shrink-0 text-right font-mono text-[10px] text-neutral-500">
                        <div>{dec.owner}</div>
                        <div>{dec.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 7: DELIVERABLES VAULT */}
          {currentSlide === 6 && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">Section 11 & 12 · Handoff & Close</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Final Deliverables Vault & Asset Download Center
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl">
                  Client deliverables package ready for production manufacturing and brand operations deployment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="p-2 w-fit rounded-lg bg-neutral-800 text-white">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Master Brand Book & QA (PDF)</h3>
                    <p className="text-xs text-neutral-400">
                      120-page interactive guideline document with typography specimens, color standards, and logo clearance rules.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-500">v1.0 · 48.2 MB</span>
                    <button
                      onClick={handleCopyHandoff}
                      className="inline-flex items-center gap-1 font-semibold text-white hover:text-neutral-300"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="p-2 w-fit rounded-lg bg-neutral-800 text-white">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Figma Token Architecture</h3>
                    <p className="text-xs text-neutral-400">
                      Complete UI component library, motion curves, elevation styles, and responsive screen templates.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-500">Live Team Access</span>
                    <button
                      onClick={handleCopyHandoff}
                      className="inline-flex items-center gap-1 font-semibold text-white hover:text-neutral-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open File</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="p-2 w-fit rounded-lg bg-neutral-800 text-white">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Commercial Rights Deed</h3>
                    <p className="text-xs text-neutral-400">
                      Unconditional intellectual property transfer deed, global trademark clearance certificate, and font licenses.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-400">Signed & Sealed</span>
                    <button
                      onClick={handleCopyHandoff}
                      className="inline-flex items-center gap-1 font-semibold text-white hover:text-neutral-300"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Close-out Seal Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Project Successfully Closed Out</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    Gate 12 Verified: All Deliverables Approved & Aftercare Active
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Client Partner: {project.client} · Single Approval Owner: {project.approvalOwner}
                  </p>
                </div>

                <button
                  onClick={handleCopyHandoff}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedText ? 'Package Link Copied!' : 'Export Final Delivery Package'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* -------------------------------------------------------------------------
          PRESENTER NOTES DRAWER (Optional Collapsible Talking Points)
      -------------------------------------------------------------------------- */}
      {showPresenterNotes && (
        <div className="shrink-0 p-4 bg-neutral-900/95 border-t border-neutral-800 max-h-48 overflow-y-auto animate-in slide-in-from-bottom duration-200">
          <div className="max-w-6xl mx-auto space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
                <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
                <span>Presenter Talking Points · Slide {currentSlide + 1} of {totalSlides} ({slideTabs[currentSlide].title})</span>
              </span>
              <button
                onClick={() => setShowPresenterNotes(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Hide Notes
              </button>
            </div>
            <ul className="text-xs text-neutral-300 space-y-1 pl-4 list-disc">
              {presenterNotes[currentSlide]?.map((note, idx) => (
                <li key={idx} className="leading-relaxed">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          BOTTOM CONTROLS BAR (Previous / Next / Slide Counter)
      -------------------------------------------------------------------------- */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 bg-neutral-900 border-t border-neutral-800 rounded-b-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span>Slide</span>
          <span className="font-bold text-white">{currentSlide + 1}</span>
          <span>of</span>
          <span>{totalSlides}</span>
        </div>

        {/* Slide navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Slide</span>
          </button>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))}
            disabled={currentSlide === totalSlides - 1}
            className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold rounded bg-white hover:bg-neutral-200 disabled:opacity-30 disabled:pointer-events-none text-neutral-950 transition-colors"
          >
            <span className="hidden sm:inline">Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] font-mono text-neutral-500 hidden sm:block">
          Use &larr; / &rarr; arrow keys or Spacebar to navigate
        </div>
      </div>
    </div>
  );
};
