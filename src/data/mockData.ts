import { Project, Department, TeamMember, Client, ChatChannel, ChatMessage, SectionGate } from '../types';

export const INITIAL_SECTIONS_TEMPLATE: SectionGate[] = [
  {
    number: 1,
    name: 'Project record',
    phase: 'Start',
    fillIn: 'Client, team, links, dates',
    gateRequirement: 'Approval owner named',
    departmentLead: 'Studio Operations (Managing Director)',
    status: 'approved',
    completedDate: '2026-10-14',
    approvedBy: 'Elena Vance',
    summary: 'Master operational record established, client NDA logged, and single approval owner assigned.',
    details: {
      clientEntity: 'Aether Olfactory Ltd.',
      primaryRepository: 'https://github.com/moission/aether-brand-system',
      designWorkspace: 'https://figma.com/@moission/aether-design-system',
      approvalOwnerNamed: 'Mohamed Salah (Founder)',
      kickoffDate: '2026-10-15',
      targetCloseDate: '2026-12-18'
    }
  },
  {
    number: 2,
    name: 'Scope and fees',
    phase: 'Start',
    fillIn: 'Goal, scope, exclusions, fees, change log',
    gateRequirement: 'Contract and deposit',
    departmentLead: 'Studio Operations (Managing Director)',
    status: 'approved',
    completedDate: '2026-10-18',
    approvedBy: 'Elena Vance',
    summary: 'Fixed-fee scope executed with 50% upfront retainer verified by Contracts and Finance.',
    details: {
      fixedFee: '£78,000 GBP',
      depositAmount: '£39,000 GBP (Received)',
      scopeSummary: 'Full brand strategy, wordmark, olfactory packaging suite, custom display typeface, physical retail guidelines.',
      explicitExclusions: 'Production manufacturing tooling, commercial photography buyout rights past Year 2.',
      changeLogEntries: 2
    }
  },
  {
    number: 3,
    name: 'Discovery',
    phase: 'Discover',
    fillIn: 'Interviews, audit, competitors, audience, evidence',
    gateRequirement: 'Research shared',
    departmentLead: 'Strategy and Research (Founder)',
    status: 'approved',
    completedDate: '2026-10-28',
    approvedBy: 'Mohamed Salah',
    summary: 'Audited 14 niche European fragrance houses; 18 qualitative customer interviews completed.',
    details: {
      interviewsCompleted: 18,
      competitorAudits: ['Byredo', 'Diptyque', 'Frederic Malle', 'Le Labo', 'Aesop'],
      keyInsight: 'Audience seeks tactile unadorned architectural materiality over ornamental heritage tropes.',
      researchDossierLink: 'https://notion.so/moission/aether-discovery-dossier'
    }
  },
  {
    number: 4,
    name: 'Creative brief',
    phase: 'Define',
    fillIn: 'Business, audience, positioning, voice, direction, success',
    gateRequirement: 'Brief signed',
    departmentLead: 'Strategy and Research (Founder)',
    status: 'approved',
    completedDate: '2026-11-02',
    approvedBy: 'Mohamed Salah & Client Board',
    summary: 'Creative brief locked: "The Architectural Scent". Counters fast-beauty with enduring timelessness.',
    details: {
      positioningStatement: 'Architectural olfaction for spaces and skins that value silent permanence.',
      targetDemographic: 'Discerning design architects, collectors, and sensory purists aged 28-55.',
      strategicSuccessMetric: 'Establish presence in top 20 tier-1 global concept destinations by Q2 2027.',
      clientSignoffTimestamp: '2026-11-02 16:45 GMT'
    }
  },
  {
    number: 5,
    name: 'Strategy and voice',
    phase: 'Define',
    fillIn: 'Foundations, naming, tagline, voice',
    gateRequirement: 'Strategy approved',
    departmentLead: 'Strategy and Research (Founder)',
    status: 'approved',
    completedDate: '2026-11-05',
    approvedBy: 'Mohamed Salah',
    summary: 'Strategic pillars cemented: Subtractive Luxury, Geological Materials, Monastic Quietude.',
    details: {
      brandTagline: 'Forms of Air, Cast in Stone',
      toneOfVoice: ['Restrained', 'Incisive', 'Sensory', 'Non-sensationalist'],
      vocabularyMatrix: 'Favor mineral, structural, atmospheric terminology; prohibit generic perfumery cliches.'
    }
  },
  {
    number: 6,
    name: 'Exploration',
    phase: 'Explore',
    fillIn: 'Directions A to C, comparison, logo rounds',
    gateRequirement: 'Direction chosen',
    departmentLead: 'Creative (Founder)',
    status: 'approved',
    completedDate: '2026-11-08',
    approvedBy: 'Mohamed Salah',
    summary: 'Presented 3 distinct structural avenues: Monolith (Direction B) chosen unanimously by stakeholders.',
    details: {
      directionA: 'Atmospheric Vapor (Fluid typographic distortion)',
      directionB: 'The Monolith (Geometric chiseled typographic structure)',
      directionC: 'Mineral Specimen (Raw typographic cataloguing)',
      selectedDirection: 'Direction B: The Monolith'
    }
  },
  {
    number: 7,
    name: 'Identity',
    phase: 'Align',
    fillIn: 'Logo, color, type, imagery, graphics, motion',
    gateRequirement: 'Identity approved',
    departmentLead: 'Creative (Founder)',
    status: 'in_progress',
    summary: 'Refining secondary bespoke ligature set and custom graphite color formulation.',
    details: {
      bespokeDisplayFont: 'Aether Monolith Display (Custom cuts)',
      paletteHexes: ['#0A0A0B', '#E5E2DC', '#7A766F', '#2A2926'],
      physicalColors: [
        {
          hex: '#0A0A0B',
          name: 'Basalt Obsidian',
          pantone: 'PANTONE Black 7 C',
          cmyk: 'C:65 M:60 Y:60 K:90',
          ral: 'RAL 9005 Tiefschwarz',
          materialSubstrate: 'Matte Cast Resin & Blind Deboss Foil',
          usageRole: 'Dominant Canvas'
        },
        {
          hex: '#E5E2DC',
          name: 'Unfilled Travertine',
          pantone: 'PANTONE Warm Gray 1 C',
          cmyk: 'C:4 M:4 Y:8 K:0',
          ral: 'RAL 9002 Grauweiss',
          materialSubstrate: '320gsm Gmund Bauhaus Uncoated Paper',
          usageRole: 'Tactile Neutral'
        },
        {
          hex: '#7A766F',
          name: 'Weathered Slate',
          pantone: 'PANTONE 7531 C',
          cmyk: 'C:35 M:32 Y:38 K:12',
          ral: 'RAL 7044 Seidengrau',
          materialSubstrate: 'Acid-Etched 316 Stainless Steel Plate',
          usageRole: 'Structural Surface'
        },
        {
          hex: '#2A2926',
          name: 'Charcoal Slag',
          pantone: 'PANTONE 419 C',
          cmyk: 'C:55 M:50 Y:50 K:70',
          ral: 'RAL 7021 Schwarzgrau',
          materialSubstrate: 'Kurz Dark Titanium Hot Stamping Foil',
          usageRole: 'Secondary Foil'
        }
      ],
      imageryArtDirection: 'Leica 35mm natural raking light on travertine and skin',
      motionPrinciples: 'Weighty decelerations, zero spring bounce, stillness before transition'
    }
  },
  {
    number: 8,
    name: 'Applications',
    phase: 'Align',
    fillIn: 'Digital, print, physical',
    gateRequirement: 'Applications approved',
    departmentLead: 'Digital Experience & Production',
    status: 'pending',
    summary: 'Prototyping e-commerce immersive checkout and 100ml tactile unbleached paper cartons.',
    details: {
      digitalDeliverables: ['Flagship e-commerce experience', 'Editorial fragrance index', 'Mobile checkout flow'],
      printDeliverables: ['Travertine debossed blotter cards', 'Quarterly journal 48pp', 'Certificate of origin'],
      physicalDeliverables: ['Brushed zinc counter flacons', 'Architectural wayfinding plaques']
    }
  },
  {
    number: 9,
    name: 'Review and approval',
    phase: 'Align',
    fillIn: 'Feedback rounds, decisions, approvals, risks',
    gateRequirement: 'Open items closed',
    departmentLead: 'Client Services and Delivery (Managing Director)',
    status: 'pending',
    summary: 'Round 1 feedback scheduled with client creative committee on Nov 14, 2026.',
    details: {
      feedbackRoundsBudgeted: 3,
      feedbackRoundsCompleted: 0,
      activeRiskItems: 'Cardboard paper mill lead-time extended by 6 business days'
    }
  },
  {
    number: 10,
    name: 'Brand book and QA',
    phase: 'Design',
    fillIn: 'Contents, final QA',
    gateRequirement: 'QA passed',
    departmentLead: 'Creative (Founder)',
    status: 'pending',
    summary: 'Layout templates set in Figma & Illustrator for 140-page clothbound Brand Specification.',
    details: {
      specificationSectionsCount: 14,
      qaChecklistItems: ['Contrast ratios', 'Print spot ink separations', 'Pantone matching', 'Bilingual typesetting']
    }
  },
  {
    number: 11,
    name: 'Handoff',
    phase: 'Deliver',
    fillIn: 'Asset register, rights, access, release',
    gateRequirement: 'Files and rights confirmed',
    departmentLead: 'Client Services and Delivery (Managing Director)',
    status: 'pending',
    summary: 'Asset directory pre-configured with IP transfer agreement and perpetual foundry licenses.',
    details: {
      packagingCADFiles: 'Pending production approval',
      cloudAssetVault: 'moission.box.com/aether-archive'
    }
  },
  {
    number: 12,
    name: 'Close-out',
    phase: 'Close',
    fillIn: 'Success review, retro, testimonial, aftercare',
    gateRequirement: 'Done',
    departmentLead: 'Studio Operations (Managing Director)',
    status: 'pending',
    summary: 'Close-out retro and 90-day post-launch brand stewardship program scheduled for Q1 2027.',
    details: {
      retroScheduledDate: '2026-12-20',
      testimonialContact: 'Julian de Vries, CEO Aether Olfactory'
    }
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    title: 'Aether Olfactory Brand System',
    client: 'Aether Fragrance House',
    clientId: 'cli-001',
    fieldOfPractice: 'Brand strategy and identity',
    coverImage: '/src/assets/images/moission_brand_identity_1794329379570.jpg',
    status: 'Approved',
    version: 'v2.1',
    lastUpdated: '10 Nov 2026',
    approvalOwner: 'Mohamed Salah',
    approvalOwnerRole: 'Founder',
    currentPhase: 'Align',
    currentSection: 7,
    progressPercent: 62,
    budget: '£78,000',
    depositStatus: 'Paid',
    kickoffDate: '15 Oct 2026',
    targetDeliveryDate: '18 Dec 2026',
    description: 'Complete brand repositioning, bespoke typography cuts, tactile packaging suite, and monolithic visual identity system.',
    sections: INITIAL_SECTIONS_TEMPLATE,
    decisions: [
      {
        id: 'dec-101',
        sectionNumber: 1,
        decisionText: 'Appoint Mohamed Salah as the sole studio Approval Owner with direct veto authority.',
        owner: 'Elena Vance',
        ownerRole: 'Managing Director',
        date: '15 Oct 2026',
        approved: true
      },
      {
        id: 'dec-102',
        sectionNumber: 2,
        decisionText: 'Approve 50% upfront deposit and lock scope with maximum of 3 formal review rounds.',
        owner: 'Elena Vance',
        ownerRole: 'Managing Director',
        date: '18 Oct 2026',
        approved: true
      },
      {
        id: 'dec-103',
        sectionNumber: 4,
        decisionText: 'Establish "Architectural Olfaction" as core creative brief positioning rather than traditional French heritage.',
        owner: 'Mohamed Salah',
        ownerRole: 'Founder',
        date: '02 Nov 2026',
        approved: true
      },
      {
        id: 'dec-104',
        sectionNumber: 6,
        decisionText: 'Select Direction B (The Monolith) with chiseled letterforms over fluid botanical avenue.',
        owner: 'Mohamed Salah',
        ownerRole: 'Founder',
        date: '08 Nov 2026',
        approved: true
      }
    ],
    deliverables: [
      {
        id: 'del-101',
        sectionNumber: 3,
        name: 'Aether_European_Competitor_Olfactory_Audit.pdf',
        fileSize: '14.2 MB',
        fileType: 'pdf',
        version: 'v1.0',
        uploadedBy: 'Dr. Soren Brandt',
        uploadedAt: '28 Oct 2026',
        status: 'approved_for_gate',
        notes: 'Audited 14 European niche fragrance houses; identified architectural void.'
      },
      {
        id: 'del-102',
        sectionNumber: 4,
        name: 'Aether_The_Architectural_Scent_Brief_Signed.pdf',
        fileSize: '4.6 MB',
        fileType: 'pdf',
        version: 'v1.1',
        uploadedBy: 'Callum O’Shea',
        uploadedAt: '02 Nov 2026',
        status: 'approved_for_gate',
        notes: 'Client board countersigned.'
      },
      {
        id: 'del-103',
        sectionNumber: 6,
        name: 'Aether_Directions_A_to_C_Monolith_Selection.fig',
        fileSize: '48.9 MB',
        fileType: 'figma',
        version: 'v2.0',
        uploadedBy: 'Mohamed Salah',
        uploadedAt: '08 Nov 2026',
        status: 'approved_for_gate',
        notes: 'Direction B (The Monolith) unanimously chosen.'
      },
      {
        id: 'del-104',
        sectionNumber: 7,
        name: 'Aether_Monolith_Typography_Specimen_Draft.fig',
        fileSize: '36.4 MB',
        fileType: 'figma',
        version: 'v2.1',
        uploadedBy: 'Nadia Chen',
        uploadedAt: '10 Nov 2026',
        status: 'under_review',
        notes: 'Pending final kerning and ligature approval from Founder.'
      },
      {
        id: 'del-105',
        sectionNumber: 7,
        name: 'Aether_Cotton_Travertine_Die_Deboss_Spec.pdf',
        fileSize: '8.1 MB',
        fileType: 'pdf',
        version: 'v1.4',
        uploadedBy: 'Kari Lindqvist',
        uploadedAt: '10 Nov 2026',
        status: 'under_review',
        notes: '0.45mm depth confirmed with German litho partner.'
      }
    ]
  },
  {
    id: 'proj-002',
    title: 'Solis Gallery Wayfinding & Spatial Identity',
    client: 'Solis Contemporary Art Foundation',
    clientId: 'cli-002',
    fieldOfPractice: 'Environmental and signage',
    coverImage: '/src/assets/images/moission_spatial_design_1794329379123.jpg',
    status: 'Approved',
    version: 'v1.4',
    lastUpdated: '09 Nov 2026',
    approvalOwner: 'Mohamed Salah',
    approvalOwnerRole: 'Founder',
    currentPhase: 'Align',
    currentSection: 8,
    progressPercent: 74,
    budget: '£64,000',
    depositStatus: 'Paid',
    kickoffDate: '20 Sep 2026',
    targetDeliveryDate: '30 Nov 2026',
    description: 'Architectural signage, tactile brushed steel floor totems, gallery room numbers, and bilingual exhibition typography.',
    sections: INITIAL_SECTIONS_TEMPLATE.map(s => {
      if (s.number <= 8) return { ...s, status: 'approved' as const, completedDate: '2026-11-04' };
      return { ...s, status: 'pending' as const };
    }),
    decisions: [
      {
        id: 'dec-201',
        sectionNumber: 1,
        decisionText: 'Mohamed Salah confirmed as Approval Owner.',
        owner: 'Elena Vance',
        ownerRole: 'Managing Director',
        date: '20 Sep 2026',
        approved: true
      },
      {
        id: 'dec-202',
        sectionNumber: 7,
        decisionText: 'Bespoke Grotesk with high legibility at 15-meter viewing distances approved for all public gallery pylons.',
        owner: 'Mohamed Salah',
        ownerRole: 'Founder',
        date: '28 Oct 2026',
        approved: true
      }
    ]
  },
  {
    id: 'proj-003',
    title: 'Lumina OS Adaptive Design System',
    client: 'Lumina Robotics Platform',
    clientId: 'cli-003',
    fieldOfPractice: 'UI/UX design',
    coverImage: '/src/assets/images/moission_digital_product_1794329379218.jpg',
    status: 'Not approved',
    version: 'v0.9',
    lastUpdated: '10 Nov 2026',
    approvalOwner: 'Mohamed Salah',
    approvalOwnerRole: 'Founder',
    currentPhase: 'Define',
    currentSection: 4,
    progressPercent: 35,
    budget: '£92,000',
    depositStatus: 'Paid',
    kickoffDate: '28 Oct 2026',
    targetDeliveryDate: '15 Jan 2027',
    description: 'Next-generation industrial robotic control interface, high-density telemetry dashboards, and component token library.',
    sections: INITIAL_SECTIONS_TEMPLATE.map(s => {
      if (s.number <= 3) return { ...s, status: 'approved' as const, completedDate: '2026-11-06' };
      if (s.number === 4) return { ...s, status: 'in_progress' as const };
      return { ...s, status: 'pending' as const };
    }),
    decisions: [
      {
        id: 'dec-301',
        sectionNumber: 1,
        decisionText: 'Approval owner locked to Founder. Scope restricted to design tokens and web client framework.',
        owner: 'Elena Vance',
        ownerRole: 'Managing Director',
        date: '28 Oct 2026',
        approved: true
      }
    ]
  },
  {
    id: 'proj-004',
    title: 'Aethel Organic Paper & Botanical Packaging',
    client: 'Aethel Botanics Nordic',
    clientId: 'cli-004',
    fieldOfPractice: 'Graphic and print design',
    coverImage: '/src/assets/images/moission_packaging_craft_1794329379949.jpg',
    status: 'Approved',
    version: 'v3.0',
    lastUpdated: '06 Nov 2026',
    approvalOwner: 'Elena Vance',
    approvalOwnerRole: 'Managing Director',
    currentPhase: 'Deliver',
    currentSection: 11,
    progressPercent: 91,
    budget: '£45,000',
    depositStatus: 'Paid',
    kickoffDate: '10 Aug 2026',
    targetDeliveryDate: '25 Nov 2026',
    description: 'FSC-certified seed-embedded packaging boxes, cold foil typography, and sustainable cosmetic apothecary containers.',
    sections: INITIAL_SECTIONS_TEMPLATE.map(s => {
      if (s.number <= 10) return { ...s, status: 'approved' as const, completedDate: '2026-10-30' };
      if (s.number === 11) return { ...s, status: 'in_progress' as const };
      return { ...s, status: 'pending' as const };
    }),
    decisions: [
      {
        id: 'dec-401',
        sectionNumber: 10,
        decisionText: 'Passed structural QA on 320gsm unbleached pulp cartons. 0% chemical laminate verified.',
        owner: 'Kari Lindqvist',
        ownerRole: 'Production Lead',
        date: '02 Nov 2026',
        approved: true
      }
    ]
  }
];

export const DEPARTMENTS: Department[] = [
  {
    id: 'dept-strategy',
    name: 'Strategy and Research',
    ledBy: 'Founder',
    leadName: 'Mohamed Salah',
    leadTitle: 'Founder & Executive Creative Director',
    owns: 'Evidence, positioning, naming and voice',
    leadsSections: '3 Discovery, 4 Creative brief, 5 Strategy and voice',
    leadSectionNumbers: [3, 4, 5],
    description: 'Establishes the intellectual and market foundation before a single visual asset is drafted. Grounded in rigor, fieldwork, and distinct voice.',
    teams: [
      {
        id: 'team-research',
        name: 'Research and Insights',
        covers: 'Interviews, audits, competitors, audience, evidence',
        fieldsOfPractice: ['Brand strategy and identity'],
        memberCount: 3
      },
      {
        id: 'team-strategy-voice',
        name: 'Brand Strategy and Voice',
        covers: 'Positioning, foundations, naming, tagline, voice',
        fieldsOfPractice: ['Brand strategy and identity'],
        memberCount: 2
      }
    ]
  },
  {
    id: 'dept-creative',
    name: 'Creative',
    ledBy: 'Founder',
    leadName: 'Mohamed Salah',
    leadTitle: 'Founder & Executive Creative Director',
    owns: 'Directions, identity system, brand book',
    leadsSections: '6 Exploration, 7 Identity, 10 Brand book and QA',
    leadSectionNumbers: [6, 7, 10],
    description: 'Crafts enduring visual systems, bespoke typographical foundations, art direction, and meticulous studio brand manuals.',
    teams: [
      {
        id: 'team-identity',
        name: 'Identity Design',
        covers: 'Directions A to C, logo, color, type, graphics',
        fieldsOfPractice: ['Brand strategy and identity', 'Graphic and print design'],
        memberCount: 4
      },
      {
        id: 'team-art-direction',
        name: 'Art Direction and Imagery',
        covers: 'Photography, imagery, art direction, lookbooks',
        fieldsOfPractice: ['Art direction and photography'],
        memberCount: 2
      },
      {
        id: 'team-brand-book',
        name: 'Brand Book',
        covers: 'Guidelines, templates, final brand book, documentation',
        fieldsOfPractice: ['Brand strategy and identity'],
        memberCount: 2
      }
    ]
  },
  {
    id: 'dept-digital',
    name: 'Digital Experience',
    ledBy: 'Founder',
    leadName: 'Mohamed Salah',
    leadTitle: 'Founder & Executive Creative Director',
    owns: 'UI/UX, web, product and service design',
    leadsSections: '8 Applications (digital)',
    leadSectionNumbers: [8],
    description: 'Transforms studio identities into fluid digital products, responsive web architecture, and interactive customer journeys.',
    teams: [
      {
        id: 'team-ui-ux',
        name: 'UI/UX',
        covers: 'Interfaces, flows, interactive prototypes, design systems',
        fieldsOfPractice: ['UI/UX design', 'Web design'],
        memberCount: 3
      },
      {
        id: 'team-web-social',
        name: 'Web and Social',
        covers: 'Flagship websites, social campaigns, digital release assets',
        fieldsOfPractice: ['Social and campaign design', 'Web design'],
        memberCount: 2
      },
      {
        id: 'team-product-service',
        name: 'Product and Service Design',
        covers: 'Service blueprints, customer touchpoints, systems',
        fieldsOfPractice: ['Product and service design'],
        memberCount: 2
      }
    ]
  },
  {
    id: 'dept-production',
    name: 'Production',
    ledBy: 'Production Lead',
    leadName: 'Kari Lindqvist',
    leadTitle: 'Head of Production & Fabrication',
    owns: 'Print, packaging, environmental, 3D and motion output',
    leadsSections: '8 Applications (print and physical)',
    leadSectionNumbers: [8],
    description: 'Translates studio visions into physical matter: master lithography, luxury packaging, architectural wayfinding, and dynamic motion systems.',
    teams: [
      {
        id: 'team-print-pack',
        name: 'Print and Packaging',
        covers: 'Print collateral, luxury packaging, unboxing experiences',
        fieldsOfPractice: ['Graphic and print design', 'Packaging design'],
        memberCount: 3
      },
      {
        id: 'team-env-3d',
        name: 'Environmental and 3D',
        covers: 'Signage, wayfinding, architectural installations, 3D',
        fieldsOfPractice: ['Environmental and signage', '3D design'],
        memberCount: 2
      },
      {
        id: 'team-motion',
        name: 'Motion',
        covers: 'Animation, motion identity, audio-visual kinetic branding',
        fieldsOfPractice: ['Motion design'],
        memberCount: 2
      }
    ]
  },
  {
    id: 'dept-client-services',
    name: 'Client Services and Delivery',
    ledBy: 'Managing Director',
    leadName: 'Elena Vance',
    leadTitle: 'Managing Director & Partner',
    owns: 'Client relationship, feedback rounds, handoff',
    leadsSections: '9 Review and approval, 11 Handoff',
    leadSectionNumbers: [9, 11],
    description: 'Guarantees unshakeable trust, steers structured client reviews, manages contractual risks, and executes seamless asset release.',
    teams: [
      {
        id: 'team-client-partner',
        name: 'Client Partnership',
        covers: 'Feedback rounds, approvals, stakeholder escalations',
        fieldsOfPractice: ['All fields'],
        memberCount: 3
      },
      {
        id: 'team-qa-handoff',
        name: 'QA and Handoff',
        covers: 'Final QA, asset register, licensing, rights release',
        fieldsOfPractice: ['All fields'],
        memberCount: 2
      }
    ]
  },
  {
    id: 'dept-studio-ops',
    name: 'Studio Operations',
    ledBy: 'Managing Director',
    leadName: 'Elena Vance',
    leadTitle: 'Managing Director & Partner',
    owns: 'Project records, contracts, fees, close-out',
    leadsSections: '1 Project record, 2 Scope and fees, 12 Close-out',
    leadSectionNumbers: [1, 2, 12],
    description: 'Maintains studio governance, ensures financial hygiene, tracks milestone gates, and administers aftercare and retrospectives.',
    teams: [
      {
        id: 'team-pm',
        name: 'Project Management',
        covers: 'Project records, timelines, task tracking, studio resource planning',
        fieldsOfPractice: ['All fields'],
        memberCount: 3
      },
      {
        id: 'team-contracts-finance',
        name: 'Contracts and Finance',
        covers: 'Scope, fee models, milestone deposits, change orders',
        fieldsOfPractice: ['All fields'],
        memberCount: 2
      }
    ]
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'mem-001',
    name: 'Mohamed Salah',
    email: 'mohamed@moission.studio',
    role: 'Founder',
    department: 'Strategy, Creative, Digital Experience',
    team: 'Identity Design & Strategy',
    specialty: 'Direction, review and approval, hands-on design',
    tools: ['Figma', 'Photoshop', 'Illustrator', 'Studio app'],
    worksOnSections: [3, 4, 5, 6, 7, 8, 10],
    avatar: 'MS',
    assignedProjectsCount: 4,
    status: 'lead'
  },
  {
    id: 'mem-002',
    name: 'Elena Vance',
    email: 'elena@moission.studio',
    role: 'Managing Director',
    department: 'Client Services, Studio Operations',
    team: 'Executive Leadership',
    specialty: 'Client escalations, delegation, reporting to Founder',
    tools: ['Studio app'],
    worksOnSections: [1, 2, 9, 11, 12],
    avatar: 'EV',
    assignedProjectsCount: 4,
    status: 'lead'
  },
  {
    id: 'mem-003',
    name: 'Kari Lindqvist',
    email: 'kari@moission.studio',
    role: 'Production Lead',
    department: 'Production',
    team: 'Print and Packaging',
    specialty: 'Material science, fabrication tolerances, print QA',
    tools: ['Illustrator', 'Photoshop', 'Studio app'],
    worksOnSections: [8, 10, 11],
    avatar: 'KL',
    assignedProjectsCount: 3,
    status: 'lead'
  },
  {
    id: 'mem-004',
    name: 'Julian Hayes',
    email: 'julian@moission.studio',
    role: 'Project Manager',
    department: 'Studio Operations',
    team: 'Project Management',
    specialty: 'Timelines, task tracking, project record',
    tools: ['Studio app'],
    worksOnSections: [1, 12],
    avatar: 'JH',
    assignedProjectsCount: 4,
    status: 'available'
  },
  {
    id: 'mem-005',
    name: 'Amara Sterling',
    email: 'amara@moission.studio',
    role: 'Contracts and Finance Lead',
    department: 'Studio Operations',
    team: 'Contracts and Finance',
    specialty: 'Scope, fees, deposit, change log',
    tools: ['Studio app'],
    worksOnSections: [2],
    avatar: 'AS',
    assignedProjectsCount: 3,
    status: 'available'
  },
  {
    id: 'mem-006',
    name: 'Dr. Soren Brandt',
    email: 'soren@moission.studio',
    role: 'Research Lead',
    department: 'Strategy and Research',
    team: 'Research and Insights',
    specialty: 'Interviews, competitor audits, audience evidence',
    tools: ['Studio app'],
    worksOnSections: [3],
    avatar: 'SB',
    assignedProjectsCount: 2,
    status: 'busy'
  },
  {
    id: 'mem-007',
    name: 'Callum O’Shea',
    email: 'callum@moission.studio',
    role: 'Brand Strategist',
    department: 'Strategy and Research',
    team: 'Brand Strategy and Voice',
    specialty: 'Positioning, naming, tagline, tone of voice',
    tools: ['Figma'],
    worksOnSections: [4, 5],
    avatar: 'CO',
    assignedProjectsCount: 2,
    status: 'available'
  },
  {
    id: 'mem-008',
    name: 'Nadia Chen',
    email: 'nadia@moission.studio',
    role: 'Identity Designer',
    department: 'Creative',
    team: 'Identity Design',
    specialty: 'Logo, color and type systems',
    tools: ['Illustrator', 'Figma'],
    worksOnSections: [6, 7],
    avatar: 'NC',
    assignedProjectsCount: 3,
    status: 'busy'
  },
  {
    id: 'mem-009',
    name: 'Theo Moretti',
    email: 'theo@moission.studio',
    role: 'Art Director',
    department: 'Creative',
    team: 'Art Direction and Imagery',
    specialty: 'Imagery, photography direction, moodboards',
    tools: ['Photoshop', 'Figma'],
    worksOnSections: [6, 7],
    avatar: 'TM',
    assignedProjectsCount: 2,
    status: 'available'
  },
  {
    id: 'mem-010',
    name: 'Claire Dupont',
    email: 'claire@moission.studio',
    role: 'Brand Book Designer',
    department: 'Creative',
    team: 'Brand Book',
    specialty: 'Guidelines, templates, layout',
    tools: ['Figma', 'Illustrator'],
    worksOnSections: [10],
    avatar: 'CD',
    assignedProjectsCount: 2,
    status: 'available'
  },
  {
    id: 'mem-011',
    name: 'Liam Zhang',
    email: 'liam@moission.studio',
    role: 'UI/UX Designer',
    department: 'Digital Experience',
    team: 'UI/UX',
    specialty: 'Interfaces, flows, prototypes',
    tools: ['Figma'],
    worksOnSections: [8],
    avatar: 'LZ',
    assignedProjectsCount: 2,
    status: 'busy'
  },
  {
    id: 'mem-012',
    name: 'Maya Kowalski',
    email: 'maya@moission.studio',
    role: 'Web and Social Designer',
    department: 'Digital Experience',
    team: 'Web and Social',
    specialty: 'Websites, social and campaign assets',
    tools: ['Figma', 'Photoshop'],
    worksOnSections: [8],
    avatar: 'MK',
    assignedProjectsCount: 2,
    status: 'available'
  },
  {
    id: 'mem-013',
    name: 'Gaston Rivera',
    email: 'gaston@moission.studio',
    role: 'Service Designer',
    department: 'Digital Experience',
    team: 'Product and Service Design',
    specialty: 'Service systems and processes',
    tools: ['Figma'],
    worksOnSections: [6, 8],
    avatar: 'GR',
    assignedProjectsCount: 1,
    status: 'available'
  },
  {
    id: 'mem-014',
    name: 'Anika Solberg',
    email: 'anika@moission.studio',
    role: 'Print and Packaging Designer',
    department: 'Production',
    team: 'Print and Packaging',
    specialty: 'Print collateral, packaging',
    tools: ['Illustrator', 'Photoshop'],
    worksOnSections: [8],
    avatar: 'AS',
    assignedProjectsCount: 2,
    status: 'available'
  },
  {
    id: 'mem-015',
    name: 'Viktor Meyer',
    email: 'viktor@moission.studio',
    role: 'Environmental and 3D Designer',
    department: 'Production',
    team: 'Environmental and 3D',
    specialty: 'Signage, wayfinding, spatial and 3D work',
    tools: ['Illustrator'],
    worksOnSections: [8],
    avatar: 'VM',
    assignedProjectsCount: 2,
    status: 'available'
  },
  {
    id: 'mem-016',
    name: 'Tatsuya Sato',
    email: 'tatsuya@moission.studio',
    role: 'Motion Designer',
    department: 'Production',
    team: 'Motion',
    specialty: 'Animation, motion identity',
    tools: ['Studio tools'],
    worksOnSections: [7, 8],
    avatar: 'TS',
    assignedProjectsCount: 1,
    status: 'available'
  },
  {
    id: 'mem-017',
    name: 'Rachel Adler',
    email: 'rachel@moission.studio',
    role: 'Account Manager',
    department: 'Client Services and Delivery',
    team: 'Client Partnership',
    specialty: 'Feedback rounds, approvals, client communication',
    tools: ['Studio app'],
    worksOnSections: [9],
    avatar: 'RA',
    assignedProjectsCount: 3,
    status: 'available'
  },
  {
    id: 'mem-018',
    name: 'Henrik Visser',
    email: 'henrik@moission.studio',
    role: 'QA and Handoff Specialist',
    department: 'Client Services and Delivery',
    team: 'QA and Handoff',
    specialty: 'Final QA, asset register, rights, release',
    tools: ['Studio app'],
    worksOnSections: [10, 11],
    avatar: 'HV',
    assignedProjectsCount: 2,
    status: 'available'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    name: 'Aether Olfactory Ltd.',
    industry: 'Luxury Fragrance & Fine Materials',
    contactPerson: 'Julian de Vries',
    contactEmail: 'julian@aether-fragrances.com',
    contactRole: 'Chief Executive Officer',
    avatar: 'AO',
    activeProjects: ['Aether Olfactory Brand System'],
    totalValue: '£78,000',
    contractStatus: 'Active',
    portalAccess: true,
    latestGateApproved: 'Gate 6: Direction chosen (The Monolith)',
    aftercareStatus: 'Retainer',
    notes: 'Requested strict adherence to stone and graphite aesthetics. Ready for Gate 7 identity review.'
  },
  {
    id: 'cli-002',
    name: 'Solis Contemporary Art Foundation',
    industry: 'Cultural Institution & Gallery',
    contactPerson: 'Hélène de Saint-Germain',
    contactEmail: 'helene@solisfoundation.org',
    contactRole: 'Director of Curatorial Architecture',
    avatar: 'SF',
    activeProjects: ['Solis Gallery Wayfinding & Spatial Identity'],
    totalValue: '£64,000',
    contractStatus: 'Active',
    portalAccess: true,
    latestGateApproved: 'Gate 8: Applications approved (Brushed steel pylons)',
    aftercareStatus: 'Standard',
    notes: 'Architectural installation slated for Berlin main gallery space. Fabrication underway.'
  },
  {
    id: 'cli-003',
    name: 'Lumina Robotics Platform',
    industry: 'Autonomous Systems & Aerospace',
    contactPerson: 'Marcus Vance-Reid',
    contactEmail: 'm.reid@luminarobotics.io',
    contactRole: 'VP Product & Software',
    avatar: 'LR',
    activeProjects: ['Lumina OS Adaptive Design System'],
    totalValue: '£92,000',
    contractStatus: 'Active',
    portalAccess: true,
    latestGateApproved: 'Gate 3: Research shared (Audience evidence)',
    aftercareStatus: 'Onboarding',
    notes: 'Complex multi-tier operator telemetry. Strategy before visuals strictly maintained.'
  },
  {
    id: 'cli-004',
    name: 'Aethel Botanics Nordic',
    industry: 'Sustainable Wellness & Apothecary',
    contactPerson: 'Freja Lindemann',
    contactEmail: 'freja@aethelbotanics.se',
    contactRole: 'Founder & Head of Product',
    avatar: 'AB',
    activeProjects: ['Aethel Organic Paper & Botanical Packaging'],
    totalValue: '£45,000',
    contractStatus: 'Completed',
    portalAccess: true,
    latestGateApproved: 'Gate 11: Files and rights confirmed',
    aftercareStatus: 'Standard',
    notes: 'Swedish organic seal verified. Final production cartons shipped to Stockholm distribution center.'
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'chan-001',
    name: 'aether-brand-system',
    type: 'project',
    description: 'Aether Olfactory identity system, typeface cuts, and tactile packaging',
    unreadCount: 1,
    projectId: 'proj-001'
  },
  {
    id: 'chan-002',
    name: 'solis-spatial-wayfinding',
    type: 'project',
    description: 'Gallery architectural signage, brushed steel fabrication, site audits',
    unreadCount: 0,
    projectId: 'proj-002'
  },
  {
    id: 'chan-003',
    name: 'lumina-os-tokens',
    type: 'project',
    description: 'Robotic telemetry UI, token library, high-density contrast tests',
    unreadCount: 2,
    projectId: 'proj-003'
  },
  {
    id: 'chan-004',
    name: 'strategy-and-research',
    type: 'department',
    description: 'Led by Founder: Evidence, audits, positioning, and brand voice discourse',
    departmentId: 'dept-strategy'
  },
  {
    id: 'chan-005',
    name: 'creative-critique',
    type: 'department',
    description: 'Studio-wide visual reviews, typography iterations, and artifact critiques',
    departmentId: 'dept-creative'
  },
  {
    id: 'chan-006',
    name: 'production-and-press',
    type: 'department',
    description: 'Paper stock weights, metal stamping dies, foil proofs, and QA tolerance',
    departmentId: 'dept-production'
  },
  {
    id: 'chan-007',
    name: 'dm-mohamed-salah',
    type: 'direct',
    description: 'Mohamed Salah (Founder & ECD)'
  },
  {
    id: 'chan-008',
    name: 'dm-elena-vance',
    type: 'direct',
    description: 'Elena Vance (Managing Director)'
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'chan-001': [
    {
      id: 'msg-01',
      channelId: 'chan-001',
      senderId: 'mem-001',
      senderName: 'Mohamed Salah',
      senderRole: 'Founder',
      senderAvatar: 'MS',
      content: 'I have finished reviewing the ligature test prints for Aether Monolith Display. The vertical ascenders at 48pt feel balanced. Direction B remains completely locked.',
      timestamp: '10 Nov 2026 · 09:15',
      isDecisionCandidate: true,
      linkedSection: 7
    },
    {
      id: 'msg-02',
      channelId: 'chan-001',
      senderId: 'mem-008',
      senderName: 'Nadia Chen',
      senderRole: 'Identity Designer',
      senderAvatar: 'NC',
      content: 'Tested the graphite blind-deboss with Kari on the unbleached cotton stock. Impression depth is 0.45mm. The tactile feel is incredible.',
      timestamp: '10 Nov 2026 · 09:42'
    },
    {
      id: 'msg-03',
      channelId: 'chan-001',
      senderId: 'mem-002',
      senderName: 'Elena Vance',
      senderRole: 'Managing Director',
      senderAvatar: 'EV',
      content: 'Reminder for Gate 7: Mohamed must formally sign off Section 7 Identity in the project workspace before we open Section 8 application prototypes to client review.',
      timestamp: '10 Nov 2026 · 10:05'
    }
  ],
  'chan-003': [
    {
      id: 'msg-10',
      channelId: 'chan-003',
      senderId: 'mem-006',
      senderName: 'Dr. Soren Brandt',
      senderRole: 'Research Lead',
      senderAvatar: 'SB',
      content: 'We concluded the 12 operator interviews in Munich. Primary friction point is ambient glare on factory-floor terminals. UI needs strict high-contrast mode with tabular figures.',
      timestamp: '09 Nov 2026 · 16:30',
      isDecisionCandidate: true,
      linkedSection: 3
    },
    {
      id: 'msg-11',
      channelId: 'chan-003',
      senderId: 'mem-001',
      senderName: 'Mohamed Salah',
      senderRole: 'Founder',
      senderAvatar: 'MS',
      content: 'Strict rule: Strategy before visuals. Do not start wireframes until Callum finishes the positioning brief and the client signs Gate 4.',
      timestamp: '09 Nov 2026 · 17:10'
    }
  ],
  'chan-004': [
    {
      id: 'msg-20',
      channelId: 'chan-004',
      senderId: 'mem-007',
      senderName: 'Callum O’Shea',
      senderRole: 'Brand Strategist',
      senderAvatar: 'CO',
      content: 'Tone of voice framework draft is posted in the workspace. We are eliminating all hyperbole. Every descriptor must be concrete and architectural.',
      timestamp: '08 Nov 2026 · 11:20'
    }
  ],
  'chan-007': [
    {
      id: 'msg-30',
      channelId: 'chan-007',
      senderId: 'mem-001',
      senderName: 'Mohamed Salah',
      senderRole: 'Founder',
      senderAvatar: 'MS',
      content: 'Elena, let us review the Q4 studio pipeline this afternoon. We have 4 in-flight projects, 3 of which are heading into Align and Deliver phases.',
      timestamp: '10 Nov 2026 · 08:30'
    }
  ],
  'chan-008': [
    {
      id: 'msg-40',
      channelId: 'chan-008',
      senderId: 'mem-002',
      senderName: 'Elena Vance',
      senderRole: 'Managing Director',
      senderAvatar: 'EV',
      content: 'All milestone deposits for Aether and Solis have settled cleanly. Client sentiment is high.',
      timestamp: '09 Nov 2026 · 18:00'
    }
  ]
};
