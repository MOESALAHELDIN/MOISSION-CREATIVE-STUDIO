import React, { useState } from 'react';
import { Project, PhaseType, FieldOfPractice } from '../../types';
import { 
  Plus, 
  ExternalLink, 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  LayoutGrid, 
  Table as TableIcon, 
  Kanban,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Eye
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  onOpenProject: (projectId: string, targetSection?: number) => void;
  onNewProject: () => void;
  onPresentProject: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenProject,
  onNewProject,
  onPresentProject
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'matrix'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const phases: PhaseType[] = ['Start', 'Discover', 'Define', 'Explore', 'Align', 'Design', 'Deliver', 'Close'];

  // Unique owners
  const owners = Array.from(new Set(projects.map(p => p.approvalOwner)));

  // Unique fields
  const fields = Array.from(new Set(projects.map(p => p.fieldOfPractice)));

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.fieldOfPractice.toLowerCase().includes(searchQuery.toLowerCase());
    const matchField = fieldFilter === 'all' || p.fieldOfPractice === fieldFilter;
    const matchPhase = phaseFilter === 'all' || p.currentPhase === phaseFilter;
    const matchOwner = ownerFilter === 'all' || p.approvalOwner === ownerFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchField && matchPhase && matchOwner && matchStatus;
  });

  // Calculate portfolio totals
  const totalValue = '£279,000';
  const avgProgress = Math.round(
    projects.reduce((acc, p) => acc + p.progressPercent, 0) / (projects.length || 1)
  );

  return (
    <div className="space-y-8 pb-20 pt-6">
      
      {/* -------------------------------------------------------------------------
          PAGE HERO SECTION (Architectural Archive Image Banner)
      -------------------------------------------------------------------------- */}
      <section className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 shadow-md">
        <div className="relative aspect-[21/9] sm:aspect-[24/8] w-full min-h-[220px] sm:min-h-[260px]">
          <img
            src="/images/moission_projects_hero_1794330855473.jpg"
            alt="MOISSION Project Archives and Material Flat Lay"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Measured contrast scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-black/30" />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
              <span>Studio Portfolio Directory</span>
              <span aria-hidden="true">·</span>
              <span>12 Sections · 8 Phases</span>
              <span aria-hidden="true">·</span>
              <span>Fixed Governance</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl" style={{ textWrap: 'balance' }}>
                  Client Engagements & Phased Production Archive
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
                  Comprehensive catalogue of all active studio work. Each project adheres to strategy before visuals, owner-verified gates, and signed page decisions.
                </p>
              </div>

              {/* Floating Hero Metric Badges */}
              <div className="flex items-center gap-4 shrink-0 bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Total Pipeline</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-white">{totalValue}</div>
                </div>
                <div className="h-7 w-px bg-white/20" />
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Avg Completion</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-400">{avgProgress}%</div>
                </div>
                <div className="h-7 w-px bg-white/20" />
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Projects</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-white">{projects.length} Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          FILTER BAR & VIEW MODE CONTROLS
      -------------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        
        {/* Left: View Mode Segmented Switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg self-start">
          <button
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Showcase Grid</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Data Table</span>
          </button>

          <button
            onClick={() => setViewMode('matrix')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'matrix'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Phase Matrix</span>
          </button>
        </div>

        {/* Right: Live Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, client..."
              className="pl-8 pr-3 py-1.5 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 w-44 sm:w-56"
            />
          </div>

          <select
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer max-w-[150px] truncate"
          >
            <option value="all">All Fields</option>
            {fields.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
          >
            <option value="all">All 8 Phases</option>
            {phases.map(p => (
              <option key={p} value={p}>Phase: {p}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Not approved">Not approved</option>
          </select>

          <button
            onClick={onNewProject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Project</span>
          </button>
        </div>
      </div>

      {/* Filter Summary Counter */}
      <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
        <span>Showing {filteredProjects.length} of {projects.length} Projects</span>
        <span>Studio Rule: One Approval Owner per Project</span>
      </div>

      {/* -------------------------------------------------------------------------
          VIEW 1: SHOWCASE GRID VIEW
      -------------------------------------------------------------------------- */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => {
            const activeSec = p.sections.find(s => s.number === p.currentSection) || p.sections[0];

            return (
              <div
                key={p.id}
                className="group flex flex-col justify-between bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-200 shadow-xs"
              >
                <div>
                  {/* Cover Photo */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-800">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span className="font-mono tabular-nums px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm font-semibold">
                        {p.version}
                      </span>
                      <span className={`px-2 py-0.5 rounded backdrop-blur-sm font-medium ${
                        p.status === 'Approved' ? 'bg-emerald-950/80 text-emerald-300' : 'bg-amber-950/80 text-amber-300'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] font-medium text-neutral-300 truncate">
                        {p.fieldOfPractice}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3.5">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-white transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        Client: <strong>{p.client}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500 font-medium">Phase: {p.currentPhase}</span>
                        <span className="font-mono tabular-nums font-bold text-neutral-900 dark:text-neutral-100">
                          {p.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full transition-all duration-300"
                          style={{ width: `${p.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Key Attributes */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] space-y-1 text-neutral-500">
                      <div className="flex justify-between">
                        <span>Current Gate:</span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-200 truncate max-w-[170px]">
                          {activeSec.gateRequirement}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approval Owner:</span>
                        <span className="text-neutral-700 dark:text-neutral-300">{p.approvalOwner}</span>
                      </div>
                      <div className="flex justify-between font-mono tabular-nums">
                        <span>Budget & Deposit:</span>
                        <span>{p.budget} ({p.depositStatus})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action: Present Output & Workspace */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onPresentProject(p.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors whitespace-nowrap shadow-xs"
                    title="Present final presentation and deliverables showcase"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Present Output</span>
                  </button>
                  <button
                    onClick={() => onOpenProject(p.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
                    title="Open 12-section project workspace"
                  >
                    <span>Workspace</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* -------------------------------------------------------------------------
          VIEW 2: HIGH-DENSITY DATA TABLE VIEW
      -------------------------------------------------------------------------- */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-4 py-3">Project & Client</th>
                <th className="px-4 py-3">Field of Practice</th>
                <th className="px-4 py-3">Phase & Section</th>
                <th className="px-4 py-3">Current Gate</th>
                <th className="px-4 py-3">Approval Owner</th>
                <th className="px-4 py-3 font-mono">Fee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 font-mono">Progress</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredProjects.map((p) => {
                const activeSec = p.sections.find(s => s.number === p.currentSection) || p.sections[0];

                return (
                  <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {p.client} · <span className="font-mono">{p.version}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-600 dark:text-neutral-400">
                      {p.fieldOfPractice}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {p.currentPhase}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Sec {p.currentSection} of 12
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {activeSec.gateRequirement}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-700 dark:text-neutral-300">
                      {p.approvalOwner}
                    </td>
                    <td className="px-4 py-3.5 font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                      {p.budget}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[11px] font-semibold ${
                        p.status === 'Approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono tabular-nums text-neutral-900 dark:text-neutral-100 font-bold">
                      {p.progressPercent}%
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPresentProject(p.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-2xs"
                          title="Present final client presentation & output"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>
                        <button
                          onClick={() => onOpenProject(p.id)}
                          className="px-2.5 py-1.5 text-xs font-medium rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                          title="Open 12-section workspace"
                        >
                          Workspace
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          VIEW 3: PHASE MATRIX (Across the 8 ordered phases)
      -------------------------------------------------------------------------- */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((ph, idx) => {
            const phaseProjects = filteredProjects.filter(p => p.currentPhase === ph);

            return (
              <div
                key={ph}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col justify-between min-h-[320px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-neutral-400">0{idx + 1}</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                        {ph}
                      </h4>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {phaseProjects.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {phaseProjects.length === 0 ? (
                      <div className="py-12 text-center text-[11px] text-neutral-400 italic">
                        No projects in {ph}
                      </div>
                    ) : (
                      phaseProjects.map(proj => (
                        <div
                          key={proj.id}
                          className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all space-y-2 shadow-2xs"
                        >
                          <div className="text-[11px] font-semibold text-neutral-500 truncate">
                            {proj.client}
                          </div>
                          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                            {proj.title}
                          </div>
                          <div className="text-[10px] text-neutral-400 line-clamp-1">
                            {proj.fieldOfPractice}
                          </div>

                          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-1 text-[10px] font-mono tabular-nums">
                            <span>{proj.progressPercent}%</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onPresentProject(proj.id)}
                                className="px-1.5 py-0.5 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold text-[10px] hover:opacity-80 transition-opacity"
                                title="Present output"
                              >
                                Present
                              </button>
                              <button
                                onClick={() => onOpenProject(proj.id)}
                                className="px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                title="Open in workspace"
                              >
                                Edit →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400">
                  Phase 0{idx + 1} Gate Compliance
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
