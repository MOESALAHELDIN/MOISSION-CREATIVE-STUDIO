import React, { useState } from 'react';
import { Client, Project } from '../../types';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2, 
  User, 
  Mail, 
  FileText,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface ClientsViewProps {
  clients: Client[];
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onAddClient: (newClient: Client) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  projects,
  onOpenProject,
  onAddClient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0]);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);

  // New client form states
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactRole, setContactRole] = useState('Director');
  const [totalValue, setTotalValue] = useState('£50,000');
  const [notes, setNotes] = useState('');

  // Filter clients
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactPerson.trim()) return;

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: name.trim(),
      industry: industry.trim() || 'Creative & Cultural Enterprise',
      contactPerson: contactPerson.trim(),
      contactEmail: contactEmail.trim(),
      contactRole,
      avatar: name.slice(0, 2).toUpperCase(),
      activeProjects: [],
      totalValue,
      contractStatus: 'Active',
      portalAccess: true,
      latestGateApproved: 'Gate 1: Project record established',
      aftercareStatus: 'Onboarding',
      notes: notes.trim() || 'Client account initialized under MOISSION delivery agreement.'
    };

    onAddClient(newClient);
    setSelectedClient(newClient);
    setIsNewClientOpen(false);
    setName('');
    setContactPerson('');
    setContactEmail('');
    setNotes('');
  };

  return (
    <div className="space-y-8 pb-20 pt-6">
      
      {/* Client Partnerships Hero Image Banner */}
      <section className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 shadow-md">
        <div className="relative aspect-[21/8] sm:aspect-[24/7] w-full min-h-[200px] sm:min-h-[230px]">
          <img
            src="/images/moission_brand_identity_1794329379570.jpg"
            alt="MOISSION Client Partnerships and Delivery Governance"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/50 to-black/30" />

          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
              <span>Client Services & Delivery</span>
              <span aria-hidden="true">·</span>
              <span>Led by Elena Vance (MD)</span>
              <span aria-hidden="true">·</span>
              <span>{clients.length} Active Accounts</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white max-w-xl">
                  Client Partnerships & Delivery Gates
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-lg">
                  Direct client alignment, structured review rounds, contractual milestone gates, and long-term aftercare stewardship.
                </p>
              </div>

              <button
                onClick={() => setIsNewClientOpen(true)}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-white hover:bg-neutral-100 rounded-md transition-colors whitespace-nowrap shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Client Partner</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split: Left Client Directory List + Right Client Dossier Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Client Directory (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search client partner or industry..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>

          <div className="space-y-2">
            {filteredClients.map((client) => {
              const isSelected = selectedClient.id === client.id;
              return (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full text-left p-4 rounded-lg border transition-all text-xs space-y-2 ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 border-transparent shadow-sm'
                      : 'bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm truncate">
                      {client.name}
                    </span>
                    <span className={`font-mono tabular-nums text-xs font-semibold ${
                      isSelected ? 'opacity-90' : 'text-neutral-900 dark:text-neutral-100'
                    }`}>
                      {client.totalValue}
                    </span>
                  </div>

                  <div className={`text-[11px] truncate ${
                    isSelected ? 'opacity-80' : 'text-neutral-500'
                  }`}>
                    {client.industry} · Contact: {client.contactPerson}
                  </div>

                  <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                    isSelected ? 'border-neutral-800 dark:border-neutral-200 opacity-90' : 'border-neutral-100 dark:border-neutral-800 text-neutral-400'
                  }`}>
                    <span>Status: {client.contractStatus}</span>
                    <span>Portal: {client.portalAccess ? 'Granted' : 'Revoked'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Client Dossier & Gate Sign-off Ledger (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                  <span>CLIENT ACCOUNT</span>
                  <span aria-hidden="true">·</span>
                  <span>ID: {selectedClient.id.toUpperCase()}</span>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                  {selectedClient.name}
                </h2>
                <div className="text-xs text-neutral-500">
                  {selectedClient.industry}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-neutral-400">Total Contract Value</div>
                <div className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                  {selectedClient.totalValue}
                </div>
              </div>
            </div>

            {/* Contact & Governance Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                  Primary Client Stakeholder
                </div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedClient.contactPerson}
                </div>
                <div className="text-neutral-500">
                  {selectedClient.contactRole}
                </div>
                <div className="text-neutral-500 font-mono text-[11px] pt-1">
                  {selectedClient.contactEmail}
                </div>
              </div>

              <div className="p-3.5 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                  Governance & Aftercare
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Contract Status:</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{selectedClient.contractStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Client Portal:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedClient.portalAccess ? 'Active Access' : 'Inactive'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Stewardship Tier:</span>
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">{selectedClient.aftercareStatus}</span>
                </div>
              </div>
            </div>

            {/* Latest Gate Approved */}
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                  Latest Executive Gate Passed
                </div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {selectedClient.latestGateApproved}
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            </div>

            {/* In-Flight Projects Linked to Client */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Linked Studio Engagements
                </h3>
                <span className="text-xs font-mono text-neutral-400">
                  {projects.filter(p => p.client === selectedClient.name || p.clientId === selectedClient.id).length} Projects
                </span>
              </div>

              <div className="space-y-2">
                {projects.filter(p => p.client === selectedClient.name || p.clientId === selectedClient.id).map(proj => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {proj.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Phase: {proj.currentPhase} · Section {proj.currentSection}/12 · Owner: {proj.approvalOwner}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenProject(proj.id)}
                      className="px-3 py-1.5 rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors font-semibold text-xs whitespace-nowrap"
                    >
                      Open in Studio
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Notes & Directives */}
            <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 text-xs space-y-1">
              <div className="font-semibold text-neutral-700 dark:text-neutral-300">
                Partner Strategic Notes & Requirements
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {selectedClient.notes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {isNewClientOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Add New Client Partner
              </h3>
              <button
                onClick={() => setIsNewClientOpen(false)}
                className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Client Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vespera Architectural Monograph"
                  className="w-full px-3 py-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. High-End Editorial Publishing"
                  className="w-full px-3 py-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Marcella Rossi"
                    className="w-full px-3 py-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. m.rossi@vespera.com"
                    className="w-full px-3 py-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Contract Value (GBP)
                  </label>
                  <input
                    type="text"
                    value={totalValue}
                    onChange={(e) => setTotalValue(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Stakeholder Role
                  </label>
                  <input
                    type="text"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Briefing Notes & Client Standards
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specific requirements, design criteria, brand guidelines..."
                  className="w-full px-3 py-2 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewClientOpen(false)}
                  className="px-3 py-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded"
                >
                  Save Client Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
