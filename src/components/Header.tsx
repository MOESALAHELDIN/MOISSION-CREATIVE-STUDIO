import React from 'react';
import { Plus, Sun, Moon, CheckCircle2, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'workspace' | 'projects' | 'teams' | 'clients' | 'chat';
  setActiveTab: (tab: 'studio' | 'workspace' | 'projects' | 'teams' | 'clients' | 'chat') => void;
  onNewProject: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewProject,
  isDark,
  toggleTheme,
}) => {
  const tabs = [
    { id: 'studio', label: 'Studio' },
    { id: 'workspace', label: 'Studio Workspace' },
    { id: 'projects', label: 'Projects' },
    { id: 'teams', label: 'Teams' },
    { id: 'clients', label: 'Clients' },
    { id: 'chat', label: 'Chat' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('studio')}
            className="group flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-md"
          >
            <div className="w-8 h-8 rounded bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-950 font-bold text-sm tracking-wider">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 uppercase whitespace-nowrap">
                MOISSION
              </span>
              <span className="text-[10px] font-medium tracking-wider text-neutral-500 uppercase -mt-1">
                Creative Studio
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 5 nav links, 1-2 word labels, single line */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                  isActive
                    ? 'text-neutral-900 dark:text-neutral-50 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-neutral-900 dark:bg-neutral-100 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onNewProject}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-md transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-neutral-100 dark:border-neutral-900 gap-1 bg-neutral-50 dark:bg-neutral-950">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded-md ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
