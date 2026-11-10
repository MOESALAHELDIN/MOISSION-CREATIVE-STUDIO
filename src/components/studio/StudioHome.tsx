import React, { useState } from 'react';
import { 
  Project, 
  PhaseType 
} from '../../types';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon, 
  Layers, 
  ChevronRight, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Compass,
  Sparkles,
  Eye
} from 'lucide-react';

interface StudioHomeProps {
  projects: Project[];
  onOpenProject: (projectId: string, targetSection?: number) => void;
  onNewProject: () => void;
  onPresentProject?: (projectId: string) => void;
}

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  project: string;
  phase: PhaseType;
  type: 'gate_review' | 'client_meeting' | 'fabrication_proof';
  owner: string;
}

const STUDIO_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    date: '10 Nov 2026',
    title: 'Aether Monolith Ligature Sign-off',
    project: 'Aether Olfactory Brand System',
    phase: 'Align',
    type: 'gate_review',
    owner: 'Mohamed Salah'
  },
  {
    id: 'ev-2',
    date: '12 Nov 2026',
    title: 'Lumina Operator Research Presentation',
    project: 'Lumina OS Adaptive Design System',
    phase: 'Define',
    type: 'client_meeting',
    owner: 'Dr. Soren Brandt'
  },
  {
    id: 'ev-3',
    date: '16 Nov 2026',
    title: 'Solis Brushed Steel Gallery Pylon Audit',
    project: 'Solis Gallery Wayfinding',
    phase: 'Align',
    type: 'fabrication_proof',
    owner: 'Kari Lindqvist'
  },
  {
    id: 'ev-4',
    date: '20 Nov 2026',
    title: 'Aethel Final Unboxing QA Sign-off',
    project: 'Aethel Organic Paper & Botanical Packaging',
    phase: 'Deliver',
    type: 'gate_review',
    owner: 'Elena Vance'
  }
];

export const StudioHome: React.FC<StudioHomeProps> = ({
  projects,
  onOpenProject,
  onNewProject,
  onPresentProject
}) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>(STUDIO_EVENTS[0]);
  const [timelineFilter, setTimelineFilter] = useState<'all' | PhaseType>('all');

  const inFlightProjects = projects.filter(p => p.progressPercent < 100);
  const totalContractValue = '£279,000';

  // Urgent open tasks requiring decision / gate attention
  const openTasks = [
    {
      id: 'task-1',
      projectId: 'proj-001',
      title: 'Sign Gate 7: Aether Bespoke Typography Cuts',
      projectTitle: 'Aether Olfactory',
      section: 7,
      phase: 'Align',
      owner: 'Mohamed Salah',
      deadline: 'Today, 17:00 GMT',
      actionLabel: 'Sign Gate'
    },
    {
      id: 'task-2',
      projectId: 'proj-003',
      title: 'Review Gate 4: Lumina Creative Brief Definition',
      projectTitle: 'Lumina OS',
      section: 4,
      phase: 'Define',
      owner: 'Callum O’Shea',
      deadline: 'Tomorrow, 12:00 GMT',
      actionLabel: 'Review Brief'
    },
    {
      id: 'task-3',
      projectId: 'proj-002',
      title: 'Inspect Gate 8: Solis Pylon Fabrication Tolerance',
      projectTitle: 'Solis Spatial',
      section: 8,
      phase: 'Align',
      owner: 'Kari Lindqvist',
      deadline: '16 Nov 2026',
      actionLabel: 'Inspect Gate'
    }
  ];

  const phases: PhaseType[] = ['Start', 'Discover', 'Define', 'Explore', 'Align', 'Design', 'Deliver', 'Close'];

  return (
    <div className="space-y-12 pb-20 pt-6">
      {/* -------------------------------------------------------------------------
          AREA 1: HERO (Cinematic Architectural Studio Workspace Image Banner)
      -------------------------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 shadow-md">
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full min-h-[240px] sm:min-h-[300px]">
            <img
              src="/src/assets/images/moission_studio_hero_1794330855862.jpg"
              alt="MOISSION London Creative Studio Workspace"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-black/35" />

            {/* Hero Content Overlay */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                <span>MOISSION Creative Studio</span>
                <span aria-hidden="true">·</span>
                <span>London HQ</span>
                <span aria-hidden="true">·</span>
                <span>10 Nov 2026</span>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl" style={{ textWrap: 'balance' }}>
                    Precision governance from initial brief to close-out.
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl leading-relaxed">
                    Every project follows the same structure: 12 sections across 8 phases, with every decision recorded and every gate owned.
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 bg-black/45 backdrop-blur-md p-3 rounded-lg border border-white/10">
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">In-Flight</div>
                    <div className="text-xl font-bold font-mono tabular-nums text-white">{inFlightProjects.length} Active</div>
                  </div>
                  <div className="h-7 w-px bg-white/20" />
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Pipeline Fee</div>
                    <div className="text-xl font-bold font-mono tabular-nums text-white">{totalContractValue}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Split: Open Tasks & Quick Action Strip */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Critical Open Gates & Decision Points
              </h2>
              <span className="text-xs text-neutral-400 font-mono tabular-nums">
                3 Pending Owner Sign-off
              </span>
            </div>

            <div className="space-y-2.5">
              {openTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-200">{task.projectTitle}</span>
                      <span aria-hidden="true">·</span>
                      <span>Phase: {task.phase}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-400">Owner: {task.owner}</span>
                    </div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-white transition-colors">
                      {task.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="text-xs font-mono tabular-nums text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {task.deadline}
                    </span>
                    <button
                      onClick={() => onOpenProject(task.projectId, task.section)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded transition-colors whitespace-nowrap"
                    >
                      <span>{task.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Studio Protocol Rule Box */}
          <div className="p-5 rounded-lg bg-neutral-900 text-neutral-100 dark:bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-400 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>MOISSION 3 Cardinal Rules</span>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-neutral-400">01.</span>
                  <span><strong>One approval owner per project</strong> with direct executive veto authority.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-neutral-400">02.</span>
                  <span><strong>Strategy before visuals</strong>. No graphic artifacts until research and brief are locked.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-neutral-400">03.</span>
                  <span><strong>Every page ends with a decision</strong>, an owner name, and an execution date.</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>8 Phases · 12 Gates</span>
              <button
                onClick={onNewProject}
                className="text-white hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>Initiate Project</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          AREA 2: INSIGHTS (Analytics tools, Charts, Calendar & Timeline)
      -------------------------------------------------------------------------- */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Studio Insights & Phased Pipeline
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live gating metrics, department velocity, and calendar milestones across the 8 production phases.
            </p>
          </div>

          {/* Interactive filter control */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
            <button
              onClick={() => setTimelineFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timelineFilter === 'all'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              All Phases
            </button>
            <button
              onClick={() => setTimelineFilter('Align')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timelineFilter === 'Align'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Active: Align (3)
            </button>
            <button
              onClick={() => setTimelineFilter('Deliver')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timelineFilter === 'Deliver'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Deliver (1)
            </button>
          </div>
        </div>

        {/* 8-Phase Visual Gating Strip */}
        <div className="p-5 rounded-lg bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              8-Phase Production Progression
            </span>
            <span className="text-xs font-mono tabular-nums text-neutral-500">
              Overall Studio Gate Passing Rate: 92.4%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {phases.map((phase, idx) => {
              const activeCount = projects.filter(p => p.currentPhase === phase).length;
              const isHighlight = timelineFilter === 'all' || timelineFilter === phase;
              return (
                <div
                  key={phase}
                  className={`p-3 rounded border text-left transition-all ${
                    activeCount > 0
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 border-transparent'
                      : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  } ${!isHighlight ? 'opacity-40' : ''}`}
                >
                  <div className="text-[10px] font-mono tracking-wider opacity-60">
                    PHASE 0{idx + 1}
                  </div>
                  <div className="text-xs font-bold mt-1 uppercase tracking-tight truncate">
                    {phase}
                  </div>
                  <div className="text-[11px] font-mono tabular-nums mt-2 opacity-80">
                    {activeCount} {activeCount === 1 ? 'project' : 'projects'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights Split: Analytics Chart / Stats + Interactive Studio Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Department Velocity & Gating Metrics */}
          <div className="lg:col-span-7 p-5 rounded-lg bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Department Workload & Delivery Velocity
                </h3>
                <p className="text-xs text-neutral-500">
                  Allocations across 6 specialized departments and 15 teams
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-500">Q4 2026</span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Strategy and Research', lead: 'Mohamed Salah', load: 85, activeSections: 'Sections 3, 4, 5', color: 'bg-neutral-900 dark:bg-neutral-100' },
                { name: 'Creative', lead: 'Mohamed Salah', load: 92, activeSections: 'Sections 6, 7, 10', color: 'bg-neutral-900 dark:bg-neutral-100' },
                { name: 'Digital Experience', lead: 'Mohamed Salah', load: 60, activeSections: 'Section 8 (Digital)', color: 'bg-neutral-700 dark:bg-neutral-300' },
                { name: 'Production & Fabrication', lead: 'Kari Lindqvist', load: 78, activeSections: 'Section 8 (Print/Physical)', color: 'bg-neutral-700 dark:bg-neutral-300' },
                { name: 'Client Services & Delivery', lead: 'Elena Vance', load: 65, activeSections: 'Sections 9, 11', color: 'bg-neutral-500 dark:bg-neutral-500' },
                { name: 'Studio Operations', lead: 'Elena Vance', load: 50, activeSections: 'Sections 1, 2, 12', color: 'bg-neutral-400 dark:bg-neutral-600' },
              ].map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-900 dark:text-neutral-200">
                      {dept.name} <span className="text-neutral-400 text-[11px]">({dept.activeSections})</span>
                    </span>
                    <span className="font-mono tabular-nums text-neutral-500">{dept.load}% Capacity</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${dept.color} rounded-full transition-all duration-300`}
                      style={{ width: `${dept.load}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                  48
                </div>
                <div className="text-[11px] text-neutral-500">Decisions Recorded</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                  34 / 48
                </div>
                <div className="text-[11px] text-neutral-500">Gates Fully Passed</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  100%
                </div>
                <div className="text-[11px] text-neutral-500">Approval Owner Assigned</div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Studio Calendar with Events */}
          <div className="lg:col-span-5 p-5 rounded-lg bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-neutral-500" />
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Studio Calendar · November 2026
                  </h3>
                </div>
                <span className="text-xs font-mono text-neutral-400">W46</span>
              </div>

              {/* Event list */}
              <div className="mt-4 space-y-2">
                {STUDIO_EVENTS.map((ev) => {
                  const isSelected = selectedEvent.id === ev.id;
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`w-full text-left p-3 rounded-md transition-all border text-xs ${
                        isSelected
                          ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'
                          : 'bg-transparent border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono tabular-nums text-[11px] text-neutral-500">
                          {ev.date}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                          Phase: {ev.phase}
                        </span>
                      </div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                        {ev.title}
                      </div>
                      <div className="text-neutral-500 text-[11px] mt-0.5 truncate">
                        {ev.project} · Lead: {ev.owner}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Event Detail strip */}
            <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                Active Event Milestone
              </div>
              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                {selectedEvent.title}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Required sign-off owner: <strong>{selectedEvent.owner}</strong>. Must meet gate verification before release to client.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          AREA 3: PROJECT CARDS (One card per project with photo, % and Open in Studio)
      -------------------------------------------------------------------------- */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Active Studio Projects
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Governed by the 12-section architecture. Click any card or "Open in Studio" to enter the project workspace.
            </p>
          </div>

          <button
            onClick={onNewProject}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded transition-colors whitespace-nowrap"
          >
            <span>+ Add New Project</span>
          </button>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col justify-between bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 rounded-lg overflow-hidden transition-all duration-200"
            >
              <div>
                {/* Cover Photo */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-800">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Scrim overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Top floating metadata on image */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white">
                    <span className="font-mono tabular-nums px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                      {project.version}
                    </span>
                    <span className={`px-2 py-0.5 rounded backdrop-blur-sm font-medium ${
                      project.status === 'Approved' ? 'bg-emerald-950/80 text-emerald-300' : 'bg-amber-950/80 text-amber-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Bottom title & progress on image */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <div className="text-[11px] font-medium text-neutral-300 truncate">
                      {project.fieldOfPractice}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-white transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Client: {project.client}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Completion percentage & phase bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 font-medium">Phase: {project.currentPhase}</span>
                      <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-neutral-100">
                        {project.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full transition-all duration-300"
                        style={{ width: `${project.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata strip */}
                  <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
                    <div className="flex justify-between">
                      <span>Approval Owner:</span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[140px]">
                        {project.approvalOwner}
                      </span>
                    </div>
                    <div className="flex justify-between font-mono tabular-nums">
                      <span>Last Updated:</span>
                      <span>{project.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: "Present Output" & "Open in Studio" */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                {onPresentProject && (
                  <button
                    onClick={() => onPresentProject(project.id)}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-semibold rounded bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors whitespace-nowrap shadow-xs"
                    title="Present final client presentation & output"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Present</span>
                  </button>
                )}
                <button
                  onClick={() => onOpenProject(project.id)}
                  className={`inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    onPresentProject
                      ? 'border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      : 'w-full text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200'
                  }`}
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          AREA 4: FOOTER (Colophon, Operating Principles, Metadata)
      -------------------------------------------------------------------------- */}
      <footer className="pt-12 mt-12 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-neutral-500">
          <div>
            <div className="font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 uppercase">
              MOISSION Creative Studio
            </div>
            <div className="mt-1 text-neutral-400">
              12 sections across 8 phases. Every decision recorded, every gate owned.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-400">
            <span>Executive Direction: Mohamed Salah</span>
            <span aria-hidden="true">·</span>
            <span>Managing Director: Elena Vance</span>
            <span aria-hidden="true">·</span>
            <span>Production Lead: Kari Lindqvist</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">10 Nov 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
