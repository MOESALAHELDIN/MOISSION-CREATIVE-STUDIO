import React, { useState } from 'react';
import { ChatChannel, ChatMessage, Project, Department, TeamMember } from '../../types';
import { 
  Send, 
  Hash, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Layers,
  MessageSquare,
  Search,
  Filter,
  Users,
  Building2,
  X
} from 'lucide-react';

interface ChatViewProps {
  channels: ChatChannel[];
  messages: Record<string, ChatMessage[]>;
  onSendMessage: (channelId: string, content: string) => void;
  onPromoteDecision: (projectId: string, sectionNumber: number, decisionText: string, owner: string) => void;
  projects: Project[];
  departments: Department[];
  members: TeamMember[];
}

export const ChatView: React.FC<ChatViewProps> = ({
  channels,
  messages,
  onSendMessage,
  onPromoteDecision,
  projects,
  departments,
  members
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-001');
  const [inputText, setInputText] = useState('');
  
  // Filters: Department, Team, Member, and Message Search
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [messageSearch, setMessageSearch] = useState<string>('');

  // Promote to Decision Dialog state
  const [promoteCandidate, setPromoteCandidate] = useState<ChatMessage | null>(null);
  const [targetProjectId, setTargetProjectId] = useState<string>(projects[0]?.id || '');
  const [targetSectionNum, setTargetSectionNum] = useState<number>(7);
  const [decisionOwner, setDecisionOwner] = useState<string>('Mohamed Salah');
  const [showPromotedToast, setShowPromotedToast] = useState(false);

  // Collect all teams from departments
  const allTeams = departments.flatMap(d => d.teams);

  // Filter channels based on department / member / search
  const filteredChannels = channels.filter(chan => {
    // If department filter active
    if (departmentFilter !== 'all') {
      const matchDept = departments.find(d => d.name === departmentFilter || d.id === departmentFilter);
      if (chan.type === 'department' && chan.departmentId !== matchDept?.id) {
        return false;
      }
    }

    // If member filter active, check if direct channel or member participates
    if (memberFilter !== 'all') {
      const memberObj = members.find(m => m.name === memberFilter || m.id === memberFilter);
      if (chan.type === 'direct' && !chan.description?.includes(memberObj?.name || '')) {
        return false;
      }
    }

    return true;
  });

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const rawChannelMessages = messages[activeChannelId] || [];

  // Filter messages in active stream by Member and search text
  const filteredMessages = rawChannelMessages.filter(msg => {
    const matchMember = memberFilter === 'all' || msg.senderName === memberFilter || msg.senderId === memberFilter;
    const matchSearch = !messageSearch.trim() || msg.content.toLowerCase().includes(messageSearch.toLowerCase()) || msg.senderName.toLowerCase().includes(messageSearch.toLowerCase());
    return matchMember && matchSearch;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activeChannelId, inputText.trim());
    setInputText('');
  };

  const handleExecutePromotion = () => {
    if (!promoteCandidate) return;
    onPromoteDecision(
      targetProjectId,
      targetSectionNum,
      promoteCandidate.content,
      decisionOwner
    );
    setPromoteCandidate(null);
    setShowPromotedToast(true);
    setTimeout(() => setShowPromotedToast(false), 2600);
  };

  const clearAllFilters = () => {
    setDepartmentFilter('all');
    setTeamFilter('all');
    setMemberFilter('all');
    setMessageSearch('');
  };

  const hasActiveFilters = departmentFilter !== 'all' || teamFilter !== 'all' || memberFilter !== 'all' || messageSearch.trim() !== '';

  return (
    <div className="space-y-6 pb-20 pt-6">
      
      {/* -------------------------------------------------------------------------
          HERO IMAGE BANNER: Studio Communications & Synchronized Decision Bridge
      -------------------------------------------------------------------------- */}
      <section className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 shadow-md">
        <div className="relative aspect-[21/8] sm:aspect-[24/7] w-full min-h-[200px] sm:min-h-[230px]">
          <img
            src="/images/moission_studio_hero_1794330855862.jpg"
            alt="MOISSION Studio Collaboration & Real-Time Sync"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/50 to-black/30" />

          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
              <span>Studio Communications</span>
              <span aria-hidden="true">·</span>
              <span>Project Channels & Critiques</span>
              <span aria-hidden="true">·</span>
              <span>Direct Decision Bridge</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white max-w-xl">
                  Studio Communications & Decision Bridge
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-lg">
                  Real-time project channels and department critiques. Filter discussions by Specialist, Department, and Team.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Channels</div>
                  <div className="text-base font-bold font-mono text-white">{channels.length} Total</div>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Specialists</div>
                  <div className="text-base font-bold font-mono text-white">{members.length} Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          FILTERS TOOLBAR: Members, Department, and Team Filters
      -------------------------------------------------------------------------- */}
      <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-neutral-400 text-[11px]">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <span>Filter Chat:</span>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-950 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800">
            <Building2 className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Team Filter */}
          <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-950 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="bg-transparent font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="all">All 15 Teams</option>
              {allTeams.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Member Specialist Filter */}
          <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-950 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800">
            <User className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="bg-transparent font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="all">All Specialists</option>
              {members.map(m => (
                <option key={m.id} value={m.name}>{m.name} ({m.role.split(' ')[0]})</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline text-[11px] font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Message Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={messageSearch}
            onChange={(e) => setMessageSearch(e.target.value)}
            placeholder="Search messages or senders..."
            className="pl-8 pr-3 py-1.5 text-xs rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none w-48 sm:w-60"
          />
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          CHAT APP FRAME (Sidebar + Conversation Thread)
      -------------------------------------------------------------------------- */}
      <div className="h-[680px] flex flex-col md:flex-row rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-sm">
        
        {/* Left Channel Sidebar */}
        <div className="w-full md:w-72 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col justify-between shrink-0">
          <div className="p-3 space-y-4 overflow-y-auto">
            
            {/* Project Channels */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Project Channels
              </div>
              {filteredChannels.filter(c => c.type === 'project').map(chan => {
                const isActive = chan.id === activeChannelId;
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      <span className="truncate">{chan.name}</span>
                    </div>
                    {chan.unreadCount ? (
                      <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {chan.unreadCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Department Channels */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Departmental Channels
              </div>
              {filteredChannels.filter(c => c.type === 'department').map(chan => {
                const isActive = chan.id === activeChannelId;
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      <span className="truncate">{chan.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Direct Messages */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Direct Messages
              </div>
              {filteredChannels.filter(c => c.type === 'direct').map(chan => {
                const isActive = chan.id === activeChannelId;
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <User className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      <span className="truncate">{chan.description || chan.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Specialist: <strong>Mohamed Salah</strong></span>
            {hasActiveFilters && (
              <span className="font-mono text-emerald-500">Filtered</span>
            )}
          </div>
        </div>

        {/* Right Main Chat Frame */}
        <div className="flex-1 flex flex-col justify-between bg-white dark:bg-neutral-950 overflow-hidden">
          
          {/* Channel Header */}
          <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                <Hash className="w-4 h-4 text-neutral-400" />
                <span>{activeChannel.name}</span>
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                {activeChannel.description || 'Studio communication channel'}
              </div>
            </div>

            <div className="text-xs text-neutral-400 font-mono">
              {filteredMessages.length} Messages Shown
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="py-24 text-center text-xs text-neutral-400 space-y-2">
                <MessageSquare className="w-6 h-6 mx-auto opacity-40" />
                <div>No messages match the current Member/Department filter.</div>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="text-emerald-500 underline font-semibold">
                    Clear active filters
                  </button>
                )}
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="group flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-800 dark:text-neutral-200 shrink-0">
                    {msg.senderAvatar}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                          {msg.senderName}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-medium">
                          {msg.senderRole}
                        </span>
                        <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Action: Promote message to Decision */}
                      <button
                        onClick={() => setPromoteCandidate(msg)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded"
                        title="Promote this consensus into an official project decision record"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Promote to Decision</span>
                      </button>
                    </div>

                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input Box */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message #${activeChannel.name}...`}
                className="flex-1 px-4 py-2.5 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 disabled:opacity-40 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Promote to Decision Modal */}
      {promoteCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Promote Message to Project Decision
                </h3>
              </div>
              <button
                onClick={() => setPromoteCandidate(null)}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 italic border border-neutral-200 dark:border-neutral-800">
              "{promoteCandidate.content}"
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Project
                </label>
                <select
                  value={targetProjectId}
                  onChange={(e) => setTargetProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.client})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Section (1 to 12)
                </label>
                <select
                  value={targetSectionNum}
                  onChange={(e) => setTargetSectionNum(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  <option value={1}>Section 1: Project record</option>
                  <option value={2}>Section 2: Scope and fees</option>
                  <option value={3}>Section 3: Discovery</option>
                  <option value={4}>Section 4: Creative brief</option>
                  <option value={5}>Section 5: Strategy and voice</option>
                  <option value={6}>Section 6: Exploration</option>
                  <option value={7}>Section 7: Identity</option>
                  <option value={8}>Section 8: Applications</option>
                  <option value={9}>Section 9: Review and approval</option>
                  <option value={10}>Section 10: Brand book and QA</option>
                  <option value={11}>Section 11: Handoff</option>
                  <option value={12}>Section 12: Close-out</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Signing Approval Owner
                </label>
                <input
                  type="text"
                  value={decisionOwner}
                  onChange={(e) => setDecisionOwner(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPromoteCandidate(null)}
                className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecutePromotion}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded"
              >
                Sign & Bind Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promoted Toast */}
      {showPromotedToast && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Decision successfully promoted and bound into project record</span>
        </div>
      )}
    </div>
  );
};
