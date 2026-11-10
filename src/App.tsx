/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudioHome } from './components/studio/StudioHome';
import { WorkspaceView } from './components/workspace/WorkspaceView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ProjectDetailModal } from './components/workspace/ProjectDetailModal';
import { ProjectPresentationModal } from './components/presentation/ProjectPresentationModal';
import { NewProjectModal } from './components/workspace/NewProjectModal';
import { TeamsView } from './components/teams/TeamsView';
import { ClientsView } from './components/clients/ClientsView';
import { ChatView } from './components/chat/ChatView';
import { FloatingChatWidget } from './components/chat/FloatingChatWidget';
import { 
  Project, 
  Department, 
  TeamMember, 
  Client, 
  ChatChannel, 
  ChatMessage, 
  DecisionRecord 
} from './types';
import { 
  INITIAL_PROJECTS, 
  DEPARTMENTS, 
  TEAM_MEMBERS, 
  INITIAL_CLIENTS, 
  INITIAL_CHANNELS, 
  INITIAL_MESSAGES 
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'workspace' | 'projects' | 'teams' | 'clients' | 'chat'>('studio');
  const [isDark, setIsDark] = useState<boolean>(true);

  // Core application data state
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [channels, setChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);

  // Modals & Active Inspect States
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [targetSectionNum, setTargetSectionNum] = useState<number>(1);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [presentingProjectId, setPresentingProjectId] = useState<string | null>(null);

  // Sync theme class with documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Open project detail workspace modal
  const handleOpenProject = (projectId: string, section: number = 1) => {
    setSelectedProjectId(projectId);
    setTargetSectionNum(section);
  };

  // Open client presentation & final output showcase
  const handlePresentProject = (projectId: string) => {
    setPresentingProjectId(projectId);
  };

  // Update project in master state
  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  // Add new specialist member
  const handleAddMember = (newMember: TeamMember) => {
    setMembers(prev => [newMember, ...prev]);
  };

  // Add new department
  const handleAddDepartment = (newDept: Department) => {
    setDepartments(prev => [...prev, newDept]);
  };

  // Create new project
  const handleCreateProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);

    // Add matching project chat channel
    const newChannel: ChatChannel = {
      id: `chan-${Date.now()}`,
      name: newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24),
      type: 'project',
      description: `${newProject.title} project workspace chat`,
      unreadCount: 0,
      projectId: newProject.id
    };
    setChannels(prev => [newChannel, ...prev]);
    setMessages(prev => ({
      ...prev,
      [newChannel.id]: [
        {
          id: `msg-${Date.now()}`,
          channelId: newChannel.id,
          senderId: 'mem-001',
          senderName: 'Mohamed Salah',
          senderRole: 'Founder',
          senderAvatar: 'MS',
          content: `Project "${newProject.title}" initialized under MOISSION 12-section architecture. Approval owner: ${newProject.approvalOwner}.`,
          timestamp: '10 Nov 2026 · Just now'
        }
      ]
    }));

    // Open it directly in workspace
    setSelectedProjectId(newProject.id);
    setTargetSectionNum(1);
  };

  // Add client
  const handleAddClient = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
  };

  // Send chat message
  const handleSendMessage = (channelId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      senderId: 'mem-001',
      senderName: 'Mohamed Salah',
      senderRole: 'Founder',
      senderAvatar: 'MS',
      content,
      timestamp: '10 Nov 2026 · Just now'
    };

    setMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMessage]
    }));
  };

  // Promote chat message directly into a project section's decision log
  const handlePromoteDecision = (
    projectId: string,
    sectionNumber: number,
    decisionText: string,
    owner: string
  ) => {
    const ownerMember = members.find(m => m.name === owner);
    const newDecision: DecisionRecord = {
      id: `dec-promoted-${Date.now()}`,
      sectionNumber,
      decisionText,
      owner,
      ownerRole: ownerMember?.role || 'Executive Lead',
      date: '10 Nov 2026',
      approved: true
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          decisions: [...p.decisions, newDecision],
          lastUpdated: '10 Nov 2026'
        };
      }
      return p;
    }));
  };

  const activeProject = projects.find(p => p.id === selectedProjectId);
  const presentingProject = projects.find(p => p.id === presentingProjectId);
  const activeProjectChannel = activeProject 
    ? (channels.find(c => c.projectId === activeProject.id) || channels[0])
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewProject={() => setIsNewProjectModalOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'studio' && (
          <StudioHome
            projects={projects}
            onOpenProject={handleOpenProject}
            onNewProject={() => setIsNewProjectModalOpen(true)}
            onPresentProject={handlePresentProject}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspaceView
            projects={projects}
            onOpenProject={handleOpenProject}
            onNewProject={() => setIsNewProjectModalOpen(true)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onOpenProject={handleOpenProject}
            onNewProject={() => setIsNewProjectModalOpen(true)}
            onPresentProject={handlePresentProject}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsView
            departments={departments}
            members={members}
            onAddMember={handleAddMember}
            onAddDepartment={handleAddDepartment}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsView
            clients={clients}
            projects={projects}
            onOpenProject={handleOpenProject}
            onAddClient={handleAddClient}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView
            channels={channels}
            messages={messages}
            onSendMessage={handleSendMessage}
            onPromoteDecision={handlePromoteDecision}
            projects={projects}
            departments={departments}
            members={members}
          />
        )}
      </main>

      {/* 12-Section Project Workspace Window */}
      {activeProject && (
        <ProjectDetailModal
          project={activeProject}
          initialSection={targetSectionNum}
          onClose={() => setSelectedProjectId(null)}
          onUpdateProject={handleUpdateProject}
          teamMembers={members}
          projectMessages={activeProjectChannel ? messages[activeProjectChannel.id] || [] : []}
          onSendMessage={handleSendMessage}
          channelId={activeProjectChannel?.id}
          onPresentProject={handlePresentProject}
        />
      )}

      {/* Client Presentation & Final Output Showcase */}
      {presentingProject && (
        <ProjectPresentationModal
          project={presentingProject}
          isOpen={!!presentingProject}
          onClose={() => setPresentingProjectId(null)}
          onOpenWorkspace={handleOpenProject}
        />
      )}

      {/* New Project Initiation Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
        teamMembers={members}
      />

      {/* Floating Studio Chat Widget (Bottom-Right) */}
      <FloatingChatWidget
        channels={channels}
        messages={messages}
        onSendMessage={handleSendMessage}
        onPromoteDecision={handlePromoteDecision}
        projects={projects}
        onOpenFullChat={() => setActiveTab('chat')}
        currentTab={activeTab}
      />
    </div>
  );
}
