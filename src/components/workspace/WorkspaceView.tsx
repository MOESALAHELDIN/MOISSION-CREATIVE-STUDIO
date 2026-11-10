import React, { useState } from 'react';
import { Project, PhaseType, FieldOfPractice } from '../../types';
import { 
  Plus, 
  ExternalLink, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FolderOpen,
  Briefcase,
  Search,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface WorkspaceViewProps {
  projects: Project[];
  onOpenProject: (projectId: string, targetSection?: number) => void;
  onNewProject: () => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  projects,
  onOpenProject,
  onNewProject
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'fields' | 'list'>('pipeline');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const phases: PhaseType[] = ['Start', 'Discover', 'Define', 'Explore', 'Align', 'Design', 'Deliver', 'Close'];

  // Practice disciplines defined in the specification
  const practiceDisciplines = [
    {
      group: 'Core Fields of Practice',
      items: [
        {
          name: 'Brand strategy and identity',
          description: 'Positioning, naming, voice and the visual systems that express them.',
          leads: 'Mohamed Salah (Founder)'
        },
        {
          name: 'Visual communication design',
          description: 'Books, magazines, websites, wayfinding, illustration, motion, and strategic systems.',
          leads: 'Mohamed Salah (Founder)'
        },
        {
          name: 'Product and service design',
          description: 'Intangible goods and services, using psychology, logistics and communication.',
          leads: 'Mohamed Salah & Gaston Rivera'
        },
        {
          name: 'UI/UX design',
          description: 'User interfaces and digital experiences for web applications and digital tools.',
          leads: 'Liam Zhang (Lead UI/UX)'
        }
      ]
    },
    {
      group: 'Media and Motion',
      items: [
        { name: 'Advertising design', description: 'Commercial campaigns, conceptual narratives and media rollouts.', leads: 'Elena Vance' },
        { name: 'Editorial and publication design', description: 'Catalogues, monographs, typography systems and printed editions.', leads: 'Claire Dupont' },
        { name: 'Motion and animation design', description: 'Dynamic screen identities, kinetic logos and video assets.', leads: 'Tatsuya Sato' },
        { name: 'Information and data design', description: 'Complex data visualization, maps, reports and visual taxonomy.', leads: 'Dr. Soren Brandt' }
      ]
    },
    {
      group: 'Brand and Product',
      items: [
        { name: 'Corporate identity design', description: 'Comprehensive design guidelines, asset banks and governance.', leads: 'Mohamed Salah' },
        { name: 'Packaging design', description: 'Structural carton engineering, luxury finishes and labeling compliance.', leads: 'Kari Lindqvist & Anika Solberg' }
      ]
    },
    {
      group: 'Space and Dimension',
      items: [
        { name: 'Environmental and wayfinding design', description: 'Architectural signage, directional totem pylons and spatial graphics.', leads: 'Viktor Meyer' },
        { name: '3D and spatial design', description: 'Exhibition architecture, sculptural installations and 3D modeling.', leads: 'Viktor Meyer' }
      ]
    }
  ];

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchPhase = selectedPhase === 'all' || p.currentPhase === selectedPhase;
    const matchField = selectedField === 'all' || p.fieldOfPractice === selectedField;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPhase && matchField && matchSearch;
  });

  return (
    <div className="space-y-8 pb-20 pt-6">
      
      {/* Workspace Hero Image Banner */}
      <section className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 shadow-md">
        <div className="relative aspect-[21/8] sm:aspect-[24/7] w-full min-h-[200px] sm:min-h-[230px]">
          <img
            src="/src/assets/images/moission_spatial_design_1794330855862.jpg"
            alt="MOISSION Design and Production Stages"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/src/assets/images/moission_studio_hero_1794330855862.jpg';
            }}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/50 to-black/30" />

          {/* Overlay Text */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
              <span>Studio Workspace</span>
              <span aria-hidden="true">·</span>
              <span>Design & Production Stages</span>
              <span aria-hidden="true">·</span>
              <span>Project Pipeline</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white max-w-xl">
                  Stages & Practice Pipeline
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-lg">
                  Every project runs through 12 sections across 8 phases. Strategy precedes visuals; every section requires an owner-verified gate.
                </p>
              </div>

              <button
                onClick={onNewProject}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-white hover:bg-neutral-100 rounded-md transition-colors whitespace-nowrap shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Project</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mode Switcher & Live Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Segmented view switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            8-Phase Pipeline
          </button>
          <button
            onClick={() => setActiveTab('fields')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'fields'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Fields of Practice
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'list'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Projects Table
          </button>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or clients..."
              className="pl-8 pr-3 py-1.5 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 w-48 sm:w-64"
            />
          </div>

          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
          >
            <option value="all">All Phases</option>
            {phases.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          VIEW 1: 8-PHASE PIPELINE BOARD (Start -> Discover -> Define -> ... Close)
      -------------------------------------------------------------------------- */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>Ordered Phases (1 to 8): Start · Discover · Define · Explore · Align · Design · Deliver · Close</span>
            <span className="font-mono tabular-nums">{filteredProjects.length} Projects Shown</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((phase, pIndex) => {
              const phaseProjects = filteredProjects.filter(p => p.currentPhase === phase);

              return (
                <div
                  key={phase}
                  className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col justify-between min-h-[300px]"
                >
                  <div>
                    {/* Phase Column Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-neutral-400">0{pIndex + 1}</span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                          {phase}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {phaseProjects.length}
                      </span>
                    </div>

                    {/* Cards in this stage */}
                    <div className="space-y-3">
                      {phaseProjects.length === 0 ? (
                        <div className="py-10 text-center text-[11px] text-neutral-400 italic">
                          No active projects in this gate
                        </div>
                      ) : (
                        phaseProjects.map(proj => (
                          <div
                            key={proj.id}
                            onClick={() => onOpenProject(proj.id)}
                            className="group p-3 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 cursor-pointer transition-all shadow-xs space-y-2.5"
                          >
                            <div className="flex items-center justify-between text-[11px] text-neutral-500">
                              <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                {proj.client}
                              </span>
                              <span className="font-mono tabular-nums">{proj.version}</span>
                            </div>

                            <div className="text-xs font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-neutral-700 dark:group-hover:text-white transition-colors line-clamp-2">
                              {proj.title}
                            </div>

                            <div className="text-[11px] text-neutral-500 line-clamp-1">
                              {proj.fieldOfPractice}
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[10px] font-mono tabular-nums text-neutral-400">
                                <span>Section {proj.currentSection}/12</span>
                                <span>{proj.progressPercent}%</span>
                              </div>
                              <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full"
                                  style={{ width: `${proj.progressPercent}%` }}
                                />
                              </div>
                            </div>

                            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                              <span>Owner: {proj.approvalOwner.split(' ')[0]}</span>
                              <span className="group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5 text-neutral-900 dark:text-neutral-100 font-medium">
                                Workspace →
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Stage Gate Requirement tag */}
                  <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between">
                    <span>Gate requirement</span>
                    <span className="font-mono text-neutral-500 truncate max-w-[120px]">
                      {phase === 'Start' ? 'Deposit & Owner' : phase === 'Discover' ? 'Research shared' : phase === 'Define' ? 'Brief signed' : phase === 'Explore' ? 'Direction chosen' : phase === 'Align' ? 'Identity locked' : phase === 'Design' ? 'QA passed' : phase === 'Deliver' ? 'Files released' : 'Close-out done'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          VIEW 2: FIELDS OF PRACTICE (Curated architectural directory)
      -------------------------------------------------------------------------- */}
      {activeTab === 'fields' && (
        <div className="space-y-8">
          <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider block mb-1">
              Field of Practice Architecture
            </span>
            Projects at MOISSION are assigned exactly one primary field of practice upon initiation. Each field maps directly to the responsible studio department and delivery team.
          </div>

          <div className="space-y-8">
            {practiceDisciplines.map((category) => (
              <div key={category.group} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 pb-1 border-b border-neutral-200 dark:border-neutral-800">
                  {category.group}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((field) => {
                    const matchProjects = projects.filter(p => p.fieldOfPractice.toLowerCase().includes(field.name.toLowerCase()));

                    return (
                      <div
                        key={field.name}
                        className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                              {field.name}
                            </h4>
                            <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                              {matchProjects.length} active
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                            {field.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                          <span>Lead: {field.leads}</span>
                          <button
                            onClick={() => {
                              setSelectedField(field.name);
                              setActiveTab('pipeline');
                            }}
                            className="text-neutral-900 dark:text-neutral-100 hover:underline font-semibold"
                          >
                            Filter Stage →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          VIEW 3: PROJECTS TABLE (Tabular overview with 1-click workspace launch)
      -------------------------------------------------------------------------- */}
      {activeTab === 'list' && (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-4 py-3">Project Title & Client</th>
                <th className="px-4 py-3">Field of Practice</th>
                <th className="px-4 py-3">Phase & Section</th>
                <th className="px-4 py-3">Approval Owner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 font-mono">Progress</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredProjects.map((p) => (
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
                    <div className="font-semibold text-neutral-900 dark:text-neutral-200">
                      Phase: {p.currentPhase}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Section {p.currentSection} of 12
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-700 dark:text-neutral-300">
                    {p.approvalOwner}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] font-semibold ${
                      p.status === 'Approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-neutral-900 dark:text-neutral-100 font-semibold">
                    {p.progressPercent}%
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => onOpenProject(p.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors whitespace-nowrap"
                    >
                      Open in Studio
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
