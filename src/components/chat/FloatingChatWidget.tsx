import React, { useState } from 'react';
import { ChatChannel, ChatMessage, Project } from '../../types';
import { 
  MessageSquare, 
  X, 
  Send, 
  Hash, 
  User, 
  Maximize2, 
  ShieldCheck, 
  ChevronDown, 
  CheckCircle2 
} from 'lucide-react';

interface FloatingChatWidgetProps {
  channels: ChatChannel[];
  messages: Record<string, ChatMessage[]>;
  onSendMessage: (channelId: string, content: string) => void;
  onPromoteDecision: (projectId: string, sectionNumber: number, decisionText: string, owner: string) => void;
  projects: Project[];
  onOpenFullChat: () => void;
  currentTab: string;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  channels,
  messages,
  onSendMessage,
  onPromoteDecision,
  projects,
  onOpenFullChat,
  currentTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-001');
  const [inputText, setInputText] = useState('');
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  
  // Quick promote state
  const [promoteCandidate, setPromoteCandidate] = useState<ChatMessage | null>(null);
  const [targetProjectId, setTargetProjectId] = useState<string>(projects[0]?.id || '');
  const [targetSectionNum, setTargetSectionNum] = useState<number>(7);
  const [showPromotedToast, setShowPromotedToast] = useState(false);

  // If user is already on the full Chat tab, hide the floating popover to prevent redundancy
  if (currentTab === 'chat' && !isOpen) {
    return null;
  }

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const channelMessages = messages[activeChannelId] || [];

  // Total unread messages across channels
  const totalUnread = channels.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

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
      'Mohamed Salah'
    );
    setPromoteCandidate(null);
    setShowPromotedToast(true);
    setTimeout(() => setShowPromotedToast(false), 2400);
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom-Right) */}
      {!isOpen && (
        <aside aria-label="Floating Studio Chat" className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            aria-label="Open floating studio chat"
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4" />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-neutral-900 dark:ring-neutral-100" />
              )}
            </div>

            <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              Studio Chat
            </span>

            {totalUnread > 0 && (
              <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full bg-neutral-800 dark:bg-neutral-200 text-neutral-200 dark:text-neutral-800">
                {totalUnread}
              </span>
            )}
          </button>
        </aside>
      )}

      {/* Floating Chat Popover Window */}
      {isOpen && (
        <aside aria-label="Floating Studio Chat Window" className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] flex flex-col bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 flex items-center justify-between shrink-0">
            {/* Channel Switcher Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowChannelDropdown(!showChannelDropdown)}
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-80 transition-opacity"
              >
                <Hash className="w-3.5 h-3.5 text-neutral-500" />
                <span className="truncate max-w-[180px]">{activeChannel.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Channels Dropdown Menu */}
              {showChannelDropdown && (
                <div className="absolute top-full left-0 mt-1.5 w-60 max-h-64 overflow-y-auto rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl z-20 p-1.5 text-xs space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Project Channels
                  </div>
                  {channels.filter(c => c.type === 'project').map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveChannelId(c.id);
                        setShowChannelDropdown(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                        c.id === activeChannelId
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <span className="truncate">#{c.name}</span>
                      {c.unreadCount ? (
                        <span className="text-[10px] font-mono px-1 rounded bg-neutral-200 dark:bg-neutral-800">
                          {c.unreadCount}
                        </span>
                      ) : null}
                    </button>
                  ))}

                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                    Department Channels
                  </div>
                  {channels.filter(c => c.type === 'department').map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveChannelId(c.id);
                        setShowChannelDropdown(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                        c.id === activeChannelId
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <span className="truncate">#{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullChat();
                }}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Expand to full Chat tab"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader Channel Description */}
          <div className="px-3.5 py-1.5 bg-neutral-100/70 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 truncate">
            {activeChannel.description || 'Studio synchronized channel'}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-white dark:bg-neutral-950">
            {channelMessages.length === 0 ? (
              <div className="py-16 text-center text-xs text-neutral-400">
                No messages in #{activeChannel.name}. Send the first note!
              </div>
            ) : (
              channelMessages.map(msg => (
                <div
                  key={msg.id}
                  className="group p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800/80 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        ({msg.senderRole})
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-neutral-400">
                      {msg.timestamp.split('·')[1] || msg.timestamp}
                    </span>
                  </div>

                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-[11px]">
                    {msg.content}
                  </p>

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => setPromoteCandidate(msg)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                      title="Promote into project decision log"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>Promote to Decision</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/70 shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message #${activeChannel.name}...`}
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Promote Dialog in Floating Widget */}
          {promoteCandidate && (
            <div className="absolute inset-0 z-30 bg-neutral-950/85 backdrop-blur-xs p-4 flex flex-col justify-between text-xs animate-in fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-white">
                  <span className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Promote to Decision
                  </span>
                  <button onClick={() => setPromoteCandidate(null)}>✕</button>
                </div>

                <div className="p-2 rounded bg-neutral-900 text-neutral-300 italic text-[11px]">
                  "{promoteCandidate.content}"
                </div>

                <div>
                  <label className="text-neutral-400 text-[11px] block mb-1">Target Project</label>
                  <select
                    value={targetProjectId}
                    onChange={(e) => setTargetProjectId(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-neutral-900 border border-neutral-700 text-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 text-[11px] block mb-1">Target Section</label>
                  <select
                    value={targetSectionNum}
                    onChange={(e) => setTargetSectionNum(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded bg-neutral-900 border border-neutral-700 text-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>Section {n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPromoteCandidate(null)}
                  className="px-3 py-1 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecutePromotion}
                  className="px-3 py-1 font-semibold rounded bg-white text-neutral-950"
                >
                  Sign & Bind
                </button>
              </div>
            </div>
          )}

          {/* Toast */}
          {showPromotedToast && (
            <div className="absolute top-3 left-3 right-3 z-40 p-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-lg shadow-xl text-xs font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Promoted to Project Decision!</span>
            </div>
          )}
        </aside>
      )}
    </>
  );
};
