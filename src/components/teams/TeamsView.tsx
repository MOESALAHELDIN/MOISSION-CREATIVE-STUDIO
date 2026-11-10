import React, { useState } from 'react';
import { Department, TeamMember } from '../../types';
import { 
  Users, 
  Building2, 
  Layers, 
  ShieldCheck, 
  Wrench, 
  Briefcase, 
  Search, 
  Filter, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  X,
  UserPlus
} from 'lucide-react';

interface TeamsViewProps {
  departments: Department[];
  members: TeamMember[];
  onAddMember: (newMember: TeamMember) => void;
  onAddDepartment: (newDept: Department) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  departments,
  members,
  onAddMember,
  onAddDepartment
}) => {
  const [activeTab, setActiveTab] = useState<'org_chart' | 'departments' | 'specialties'>('org_chart');
  const [selectedToolFilter, setSelectedToolFilter] = useState<string>('all');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);

  // New Member form state
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberDept, setMemberDept] = useState(departments[0]?.name || 'Strategy and Research');
  const [memberTeam, setMemberTeam] = useState('');
  const [memberSpecialty, setMemberSpecialty] = useState('');
  const [memberTools, setMemberTools] = useState<string[]>(['Figma', 'Studio app']);
  const [memberSections, setMemberSections] = useState<number[]>([6, 7]);
  const [memberStatus, setMemberStatus] = useState<'available' | 'busy' | 'lead'>('available');

  // New Department form state
  const [deptName, setDeptName] = useState('');
  const [deptLedBy, setDeptLedBy] = useState<'Founder' | 'Managing Director' | 'Production Lead'>('Founder');
  const [deptLeadName, setDeptLeadName] = useState('Mohamed Salah');
  const [deptLeadTitle, setDeptLeadTitle] = useState('Founder & Executive Creative Director');
  const [deptOwns, setDeptOwns] = useState('');
  const [deptLeadsSections, setDeptLeadsSections] = useState('8 Applications');
  const [deptDescription, setDeptDescription] = useState('');
  const [initialTeamName, setInitialTeamName] = useState('');
  const [initialTeamCovers, setInitialTeamCovers] = useState('');

  const toolsList = ['Figma', 'Illustrator', 'Photoshop', 'Studio app', 'Studio tools', 'Cinema 4D', 'After Effects'];

  // Filtered members
  const filteredMembers = members.filter(m => {
    const matchTool = selectedToolFilter === 'all' || m.tools.includes(selectedToolFilter);
    const matchSection = selectedSectionFilter === 'all' || m.worksOnSections.includes(Number(selectedSectionFilter));
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTool && matchSection && matchSearch;
  });

  // Current teams based on selected department in form
  const selectedDeptObj = departments.find(d => d.name === memberDept) || departments[0];

  // Tool toggle
  const toggleTool = (tool: string) => {
    setMemberTools(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  // Section toggle
  const toggleSection = (sec: number) => {
    setMemberSections(prev => 
      prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec].sort((a, b) => a - b)
    );
  };

  // Submit new member
  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberRole.trim()) return;

    const initials = memberName
      .trim()
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: memberName.trim(),
      email: `${memberName.trim().toLowerCase().replace(/\s+/g, '.')}@moission.studio`,
      role: memberRole.trim(),
      department: memberDept,
      team: memberTeam.trim() || selectedDeptObj?.teams[0]?.name || 'Core Team',
      specialty: memberSpecialty.trim() || 'Creative studio specialist',
      tools: memberTools.length > 0 ? memberTools : ['Studio app'],
      worksOnSections: memberSections.length > 0 ? memberSections : [1],
      avatar: initials || 'MS',
      assignedProjectsCount: 1,
      status: memberStatus
    };

    onAddMember(newMember);
    setIsAddMemberOpen(false);
    setMemberName('');
    setMemberRole('');
    setMemberSpecialty('');
  };

  // Submit new department
  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: deptName.trim(),
      ledBy: deptLedBy,
      leadName: deptLeadName.trim() || 'Mohamed Salah',
      leadTitle: deptLeadTitle.trim() || 'Department Director',
      owns: deptOwns.trim() || 'Specialized creative systems and deliverables',
      leadsSections: deptLeadsSections.trim() || 'Specialized deliverables',
      leadSectionNumbers: [8],
      description: deptDescription.trim() || 'Autonomous studio division dedicated to precision deliverables.',
      teams: [
        {
          id: `team-${Date.now()}-1`,
          name: initialTeamName.trim() || `${deptName.trim()} Core Team`,
          covers: initialTeamCovers.trim() || 'Delivery, design, and systems production',
          fieldsOfPractice: ['All fields'],
          memberCount: 1
        }
      ]
    };

    onAddDepartment(newDept);
    setIsAddDeptOpen(false);
    setDeptName('');
    setDeptOwns('');
    setDeptDescription('');
    setInitialTeamName('');
    setInitialTeamCovers('');
  };

  return (
    <div className="space-y-8 pb-20 pt-6">
      
      {/* Teams Hero Image Banner */}
      <section className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 shadow-md">
        <div className="relative aspect-[21/8] sm:aspect-[24/7] w-full min-h-[200px] sm:min-h-[230px]">
          <img
            src="/src/assets/images/moission_studio_hero_1794330855862.jpg"
            alt="MOISSION Studio Team and Critique Room"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/50 to-black/30" />

          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
              <span>Studio Organization & Workflow</span>
              <span aria-hidden="true">·</span>
              <span>{departments.length} Departments</span>
              <span aria-hidden="true">·</span>
              <span>{members.length} Specialists</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white max-w-xl">
                  Studio Structure & Specialty Matrix
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-lg">
                  Founder leads 3 departments; Managing Director leads 2 and oversees all; Production Lead commands Production and Fabrication.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setIsAddDeptOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-colors"
                >
                  + Add Department
                </button>
                <button
                  onClick={() => setIsAddMemberOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded bg-white text-neutral-950 hover:bg-neutral-100 transition-colors shadow-sm"
                >
                  + Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* View Switcher Strip */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('org_chart')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'org_chart'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Org Chart ({departments.reduce((acc, d) => acc + d.teams.length, 0)} Teams)
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'departments'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            {departments.length} Departments
          </button>
          <button
            onClick={() => setActiveTab('specialties')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'specialties'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Member Specialties ({members.length})
          </button>
        </div>

        <div className="hidden sm:block text-xs font-mono text-neutral-400 tabular-nums">
          Studio Roster: {members.length} Active
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          VIEW 1: ORG CHART (Hierarchy & Departmental Divisions)
      -------------------------------------------------------------------------- */}
      {activeTab === 'org_chart' && (
        <div className="space-y-8">
          {/* Executive Leadership Layer */}
          <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Executive Leadership & Studio Oversight
              </span>
              <span className="text-xs font-mono text-neutral-500">Tier 0 Governance</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Founder */}
              <div className="p-4 rounded-lg border border-neutral-900 dark:border-neutral-700 bg-neutral-950 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Founder & ECD
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">Direct Approval</span>
                </div>
                <div className="text-base font-bold">Mohamed Salah</div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Leads Strategy & Research, Creative, and Digital Experience. Approves their work and provides hands-on creative direction. Works on Sections 3 to 8, 10.
                </p>
                <div className="text-[11px] font-mono text-neutral-400 pt-1">
                  Primary Tools: Figma, Photoshop, Illustrator, Studio app
                </div>
              </div>

              {/* Managing Director */}
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                    Managing Director & Partner
                  </span>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Oversees All 6</span>
                </div>
                <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">Elena Vance</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Oversees all six departments; handles client escalations; directly leads Client Services & Delivery and Studio Operations. Works on Sections 1, 2, 9, 11, 12.
                </p>
                <div className="text-[11px] font-mono text-neutral-500 pt-1">
                  Primary Tools: Studio app
                </div>
              </div>
            </div>
          </div>

          {/* Departmental & Team Split Trees */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Departmental Divisions & Specialized Teams
              </h3>
              <button
                onClick={() => setIsAddDeptOpen(true)}
                className="text-xs text-neutral-900 dark:text-neutral-100 hover:underline font-semibold"
              >
                + New Department
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-neutral-500">
                        Led by: <strong>{dept.ledBy}</strong>
                      </span>
                      <span className="font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {dept.teams.length} Teams
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {dept.name}
                    </h4>

                    <div className="text-xs text-neutral-500">
                      <strong>Leads:</strong> {dept.leadsSections}
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {dept.description}
                    </p>

                    {/* Teams in this department */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Teams:
                      </div>
                      {dept.teams.map((team) => (
                        <div
                          key={team.id}
                          className="p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-semibold text-neutral-900 dark:text-neutral-200">
                            <span>{team.name}</span>
                            <span className="text-[10px] font-mono text-neutral-400">{team.memberCount} members</span>
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            Covers: {team.covers}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                    <span className="truncate">Owns: {dept.owns}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          VIEW 2: DEPARTMENTS BREAKDOWN TABLE
      -------------------------------------------------------------------------- */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddDeptOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Department</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Led By</th>
                  <th className="px-4 py-3">Owns</th>
                  <th className="px-4 py-3">Leads Sections</th>
                  <th className="px-4 py-3">Teams & Fields</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:border-neutral-800">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-neutral-900 dark:text-neutral-100">
                      {dept.name}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-200">
                        {dept.leadName}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {dept.leadTitle}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-600 dark:text-neutral-400 max-w-xs">
                      {dept.owns}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-neutral-900 dark:text-neutral-100 font-semibold">
                        {dept.leadsSections}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        {dept.teams.map((t) => (
                          <div key={t.id} className="text-[11px] text-neutral-500">
                            • <strong>{t.name}</strong> ({t.fieldsOfPractice.join(', ')})
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          VIEW 3: MEMBER SPECIALTIES
      -------------------------------------------------------------------------- */}
      {activeTab === 'specialties' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by role, specialty or name..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 w-48 sm:w-64"
                />
              </div>

              {/* Tool Filter */}
              <select
                value={selectedToolFilter}
                onChange={(e) => setSelectedToolFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
              >
                <option value="all">All Tools</option>
                {toolsList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Works on Section Filter */}
              <select
                value={selectedSectionFilter}
                onChange={(e) => setSelectedSectionFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
              >
                <option value="all">All 12 Sections</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>Section {num}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-400 tabular-nums">
                {filteredMembers.length} of {members.length} Specialists
              </span>
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Specialist</span>
              </button>
            </div>
          </div>

          {/* Specialists Table */}
          <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3">Specialist & Role</th>
                  <th className="px-4 py-3">Team & Department</th>
                  <th className="px-4 py-3">Specialty</th>
                  <th className="px-4 py-3">Tools</th>
                  <th className="px-4 py-3">Works on Sections</th>
                  <th className="px-4 py-3 font-mono">Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-800 dark:text-neutral-200 shrink-0">
                          {m.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-neutral-100">
                            {m.name}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            {m.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-neutral-900 dark:text-neutral-200">
                        {m.team}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {m.department}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-600 dark:text-neutral-400 max-w-xs">
                      {m.specialty}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                      {m.tools.join(', ')}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-neutral-900 dark:text-neutral-100 font-semibold">
                      {m.worksOnSections.join(', ')}
                    </td>
                    <td className="px-4 py-3.5 font-mono tabular-nums">
                      <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                        m.status === 'lead' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950' : m.status === 'busy' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {m.assignedProjectsCount} in-flight
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          MODAL: ADD NEW TEAM MEMBER
      -------------------------------------------------------------------------- */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Onboard Studio Specialist
                </h3>
              </div>
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Specialist Name
                  </label>
                  <input
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="e.g. Layla Al-Mansoor"
                    className="w-full px-3 py-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    required
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    placeholder="e.g. Lead Typography Specifier"
                    className="w-full px-3 py-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Department
                  </label>
                  <select
                    value={memberDept}
                    onChange={(e) => {
                      setMemberDept(e.target.value);
                      const dept = departments.find(d => d.name === e.target.value);
                      if (dept && dept.teams.length > 0) {
                        setMemberTeam(dept.teams[0].name);
                      }
                    }}
                    className="w-full px-3 py-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Team Division
                  </label>
                  <select
                    value={memberTeam}
                    onChange={(e) => setMemberTeam(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    {selectedDeptObj?.teams.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Core Specialty
                </label>
                <input
                  type="text"
                  required
                  value={memberSpecialty}
                  onChange={(e) => setMemberSpecialty(e.target.value)}
                  placeholder="e.g. Bespoke ligature cuts, optical balancing, foundry licensing"
                  className="w-full px-3 py-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              {/* Tools Selection */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Primary Tools
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {toolsList.map(t => {
                    const isSelected = memberTools.includes(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggleTool(t)}
                        className={`px-2.5 py-1 text-[11px] rounded transition-colors ${
                          isSelected
                            ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Works On Sections (1 to 12) */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Works on Sections (Select all that apply)
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => {
                    const isSelected = memberSections.includes(num);
                    return (
                      <button
                        type="button"
                        key={num}
                        onClick={() => toggleSection(num)}
                        className={`p-1.5 text-center font-mono text-[11px] rounded border transition-colors ${
                          isSelected
                            ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 border-transparent font-bold'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'
                        }`}
                      >
                        Sec {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-3 py-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded"
                >
                  Save Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          MODAL: ADD NEW DEPARTMENT
      -------------------------------------------------------------------------- */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Establish New Studio Department
                </h3>
              </div>
              <button
                onClick={() => setIsAddDeptOpen(false)}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Acoustic & Spatial Audio Architecture"
                  className="w-full px-3 py-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Executive Overseer (Led By)
                  </label>
                  <select
                    value={deptLedBy}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setDeptLedBy(val);
                      if (val === 'Founder') {
                        setDeptLeadName('Mohamed Salah');
                        setDeptLeadTitle('Founder & Executive Creative Director');
                      } else if (val === 'Managing Director') {
                        setDeptLeadName('Elena Vance');
                        setDeptLeadTitle('Managing Director & Partner');
                      } else {
                        setDeptLeadName('Kari Lindqvist');
                        setDeptLeadTitle('Head of Production & Fabrication');
                      }
                    }}
                    className="w-full px-3 py-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    <option value="Founder">Founder (Mohamed Salah)</option>
                    <option value="Managing Director">Managing Director (Elena Vance)</option>
                    <option value="Production Lead">Production Lead (Kari Lindqvist)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Leads Sections
                  </label>
                  <input
                    type="text"
                    value={deptLeadsSections}
                    onChange={(e) => setDeptLeadsSections(e.target.value)}
                    placeholder="e.g. 7 Identity, 8 Applications"
                    className="w-full px-3 py-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Owns (Mandate & Deliverables)
                </label>
                <input
                  type="text"
                  required
                  value={deptOwns}
                  onChange={(e) => setDeptOwns(e.target.value)}
                  placeholder="e.g. Acoustic identities, tactile sound design, sonic brand books"
                  className="w-full px-3 py-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Department Mission Description
                </label>
                <textarea
                  rows={2}
                  value={deptDescription}
                  onChange={(e) => setDeptDescription(e.target.value)}
                  placeholder="Architectural purpose, collaboration guidelines, domain rigor..."
                  className="w-full px-3 py-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none resize-none"
                />
              </div>

              {/* Initial Team */}
              <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Initial Specialized Team Division
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Team Name (e.g. Spatial Sound)"
                    value={initialTeamName}
                    onChange={(e) => setInitialTeamName(e.target.value)}
                    className="px-2.5 py-1.5 rounded bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Covers (e.g. Soundscapes, audio cues)"
                    value={initialTeamCovers}
                    onChange={(e) => setInitialTeamCovers(e.target.value)}
                    className="px-2.5 py-1.5 rounded bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="px-3 py-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
