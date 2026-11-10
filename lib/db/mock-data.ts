import { ContentItem, DivisionMeta, Event, EventRegistration, User, CourseEnrollment } from "./types";

export const DIVISIONS: DivisionMeta[] = [
  {
    id: "orgintech",
    name: "OrginTech",
    tagline: "Pioneering Enterprise Software, Cloud & AI Systems",
    description: "OrginTech is the technology vanguard of MGSolutions, engineering resilient enterprise software, sovereign cloud platforms, generative AI pipelines, and mission-critical digital infrastructures for global enterprises.",
    badge: "Tech Solutions & Innovations",
    accentColor: "indigo",
    themeClass: "from-indigo-900/90 via-slate-900 to-slate-950 border-indigo-500/30",
    features: [
      "Enterprise Cloud Architecture & Hybrid Migration",
      "Autonomous AI & Real-time Inference Engines",
      "Mission-Critical Microservices & Distributed DBs",
      "Cybersecurity Zero-Trust Hardening & DevSecOps"
    ],
    stats: [
      { label: "Active Enterprise Clients", value: "140+" },
      { label: "Uptime SLA Delivered", value: "99.99%" },
      { label: "Patents & Proprietary IPs", value: "28" },
      { label: "Global Engineers", value: "450+" },
    ]
  },
  {
    id: "edtech",
    name: "MGSolutions EdTech",
    tagline: "Empowering Next-Gen Engineers & Leaders",
    description: "MGSolutions EdTech delivers industry-validated professional bootcamps, hands-on masterclasses, university partnerships, and interactive student learning modules designed by elite practitioners.",
    badge: "Education & Upskilling",
    accentColor: "emerald",
    themeClass: "from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/30",
    features: [
      "Interactive Code Labs & Capstone Projects",
      "1-on-1 Mentorship from Senior Tech Leads",
      "Recognized Industry Certifications & Accreditations",
      "Direct Enterprise Placement & Career Pipeline"
    ],
    stats: [
      { label: "Students & Learners Enrolled", value: "18,500+" },
      { label: "Course Completion Rate", value: "94.2%" },
      { label: "Hiring Partner Network", value: "250+" },
      { label: "Average Salary Uplift", value: "+65%" },
    ]
  },
  {
    id: "bbs",
    name: "BBS (Business Services)",
    tagline: "Strategic Consulting & Corporate Operations",
    description: "BBS delivers comprehensive business advisory, operational restructuring, financial engineering, corporate governance, and end-to-end enterprise scaling services for market leaders.",
    badge: "Corporate & Enterprise Services",
    accentColor: "amber",
    themeClass: "from-amber-950/70 via-slate-900 to-slate-950 border-amber-500/30",
    features: [
      "Operational Restructuring & Business Process Re-engineering",
      "Cross-Border M&A Advisory & Tech Due Diligence",
      "ESG, Regulatory Compliance & Risk Assurance",
      "Strategic Capital Allocation & Executive Interim Leadership"
    ],
    stats: [
      { label: "Client Enterprise Value Advised", value: "$4.2B" },
      { label: "Successful Turnaround Projects", value: "85+" },
      { label: "Countries with Active Projects", value: "32" },
      { label: "Senior Advisory Partners", value: "60+" },
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: "user-admin-1",
    name: "Eleanor Vance",
    email: "admin@mgsolutions.com",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bio: "Head of Operations & Digital Strategy at MGSolutions Global.",
    divisionInterest: "orgintech",
    createdAt: "2025-01-10T09:00:00Z"
  },
  {
    id: "user-student-1",
    name: "Alex Rivera",
    email: "student@mgsolutions.com",
    role: "STUDENT",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Aspiring Cloud Architect & Senior Software Engineering Student.",
    divisionInterest: "edtech",
    createdAt: "2025-03-15T14:30:00Z"
  },
  {
    id: "user-student-2",
    name: "Marcus Chen",
    email: "marcus.chen@outlook.com",
    role: "STUDENT",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Computer Science & Cloud Systems student at OrginTech.",
    divisionInterest: "orgintech",
    createdAt: "2025-04-01T10:15:00Z"
  }
];

export const INITIAL_CONTENT: ContentItem[] = [
  // OrginTech
  {
    id: "content-org-1",
    divisionId: "orgintech",
    title: "Autonomous AI Agents & Enterprise LLM Orchestration",
    slug: "autonomous-ai-agents-orchestration",
    summary: "How OrginTech designs distributed agentic systems with low-latency tool execution and enterprise compliance safeguards.",
    content: "Enterprise generative AI is rapidly moving beyond simple chat interfaces into autonomous, agentic loops that interact with production databases, CRM pipelines, and external APIs. In this architecture blueprint, OrginTech details the multi-agent consensus protocols, zero-data-leakage vector caching layers, and deterministic verification harnesses deployed across Fortune 500 financial clients.",
    category: "service",
    author: "Dr. Jonathan Ross, Head of AI Research",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    tags: ["Artificial Intelligence", "Multi-Agent Systems", "Enterprise Architecture"],
    readTime: "7 min read",
    featured: true,
    published: true,
    createdAt: "2026-02-10T11:00:00Z",
    updatedAt: "2026-02-10T11:00:00Z"
  },
  {
    id: "content-org-2",
    divisionId: "orgintech",
    title: "Scaling Financial Transaction Engines to 10 Million TPS",
    slug: "scaling-financial-transaction-engines",
    summary: "A deep dive into our custom memory-mapped ring buffer architecture that cut processing latency down to 24 microseconds.",
    content: "When processing high-frequency clearing house orders, standard relational architectures become a severe bottleneck. OrginTech engineered a bare-metal distributed ledger utilizing lock-free concurrency primitives in Rust and Kernel Bypass networking (eBPF). The result was a sustained 10M transactions per second throughput with 99.999th percentile latency under 45us.",
    category: "case-study",
    author: "OrginTech High-Performance Computing Group",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    tags: ["High Performance", "Rust", "FinTech", "Low Latency"],
    readTime: "9 min read",
    featured: false,
    published: true,
    createdAt: "2026-01-28T09:30:00Z",
    updatedAt: "2026-01-28T09:30:00Z"
  },
  {
    id: "content-org-3",
    divisionId: "orgintech",
    title: "Zero-Trust DevSecOps: Automated Supply Chain Hardening",
    slug: "zero-trust-devsecops-supply-chain",
    summary: "Securing code delivery from commit to cluster using cryptographic attestations, SLSA Level 4, and automated SBOM analysis.",
    content: "Modern software supply chains face unprecedented threats. Our sovereign DevSecOps package automates signing, ephemeral container sandboxing, and runtime policy enforcement via OPA (Open Policy Agent) to safeguard national infrastructure workloads.",
    category: "article",
    author: "Maya Lin, Chief Security Officer",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    tags: ["Cybersecurity", "DevSecOps", "Zero Trust"],
    readTime: "5 min read",
    featured: false,
    published: true,
    createdAt: "2026-03-01T14:00:00Z",
    updatedAt: "2026-03-01T14:00:00Z"
  },

  // EdTech
  {
    id: "content-ed-1",
    divisionId: "edtech",
    title: "Full-Stack Distributed Systems Engineering Masterclass",
    slug: "full-stack-distributed-systems-masterclass",
    summary: "12-week comprehensive bootcamp covering event-driven microservices, consensus protocols (Raft), Kafka, and scalable cloud architectures.",
    content: "Designed for mid-level engineers looking to break into Staff and Principal roles. This curriculum covers CAP theorem in practice, distributed consensus, write-ahead logging, partition tolerance, and live production incident war-gaming under guidance of veteran systems architects.",
    category: "course-module",
    author: "MGSolutions Engineering Academy",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    tags: ["Distributed Systems", "Cloud Native", "Staff Engineering"],
    readTime: "12 Weeks Curriculum",
    featured: true,
    published: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z"
  },
  {
    id: "content-ed-2",
    divisionId: "edtech",
    title: "Enterprise Cloud & DevOps Architect Certification Track",
    slug: "enterprise-cloud-devops-architect",
    summary: "Master Terraform, Kubernetes operator patterns, CI/CD observability, and multi-region failover strategies.",
    content: "An immersive, project-driven course guiding students through setting up GitOps pipelines with ArgoCD, cluster mesh with Istio, and real-time metrics dashboards with Prometheus and Grafana on AWS & GCP.",
    category: "course-module",
    author: "Priya Nair, Principal Cloud Instructor",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    tags: ["Kubernetes", "DevOps", "Terraform", "GCP"],
    readTime: "8 Weeks Curriculum",
    featured: false,
    published: true,
    createdAt: "2026-01-15T15:00:00Z",
    updatedAt: "2026-01-15T15:00:00Z"
  },
  {
    id: "content-ed-3",
    divisionId: "edtech",
    title: "The 2026 System Design & Technical Interview Playbook",
    slug: "system-design-technical-interview-playbook",
    summary: "Comprehensive open-access handbook featuring 35+ real-world architecture interview prompts, trade-off matrices, and mock transcripts.",
    content: "Download our curated guide used by over 10,000 students to secure offers at Tier-1 tech giants. Includes deep dives into YouTube video transcoding pipelines, Uber ride dispatching, and distributed rate limiters.",
    category: "resource",
    author: "MGSolutions Career Mentorship Council",
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    tags: ["System Design", "Career", "Interview Prep"],
    readTime: "PDF Handbook (140 Pages)",
    featured: false,
    published: true,
    createdAt: "2026-02-20T08:00:00Z",
    updatedAt: "2026-02-20T08:00:00Z"
  },

  // BBS (Business Services)
  {
    id: "content-bbs-1",
    divisionId: "bbs",
    title: "Strategic Enterprise Transformation & Operational Excellence",
    slug: "strategic-enterprise-transformation",
    summary: "End-to-end organizational restructuring, OpEx optimization, and digital transition roadmaps for legacy enterprises.",
    content: "BBS works alongside C-suite leaders to dissect cost drivers, streamline multi-tiered business units, and implement high-efficiency target operating models (TOM) that reduce SG&A overhead by up to 35% within 18 months.",
    category: "service",
    author: "Arthur Sterling, Senior Managing Partner",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    tags: ["Corporate Advisory", "Operational Excellence", "Change Management"],
    readTime: "6 min read",
    featured: true,
    published: true,
    createdAt: "2026-01-20T12:00:00Z",
    updatedAt: "2026-01-20T12:00:00Z"
  },
  {
    id: "content-bbs-2",
    divisionId: "bbs",
    title: "Post-Merger Technology Integration for $2.4B Healthcare Network",
    slug: "post-merger-tech-integration-healthcare",
    summary: "How BBS synchronized clinical operations, financial ERPs, and compliance systems across 14 hospital groups.",
    content: "Following the merger of two regional hospital networks, BBS directed the 14-month integration of electronic medical records, consolidated vendor contracts resulting in $42M in direct procurement savings, and harmonized patient data governance.",
    category: "case-study",
    author: "BBS Healthcare Advisory Practice",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    tags: ["M&A Integration", "Healthcare", "Procurement"],
    readTime: "8 min read",
    featured: false,
    published: true,
    createdAt: "2026-02-05T13:45:00Z",
    updatedAt: "2026-02-05T13:45:00Z"
  },
  {
    id: "content-bbs-3",
    divisionId: "bbs",
    title: "ESG Mandates & Corporate Governance Compliance Framework",
    slug: "esg-mandates-corporate-governance",
    summary: "Navigating EU CSRD reporting rules, carbon accountability, and boardroom fiduciary risk mitigation.",
    content: "Regulatory disclosure laws are shifting rapidly. BBS provides comprehensive sustainability audit methodologies, carbon baseline verification, and ESG board reporting frameworks that safeguard international market access.",
    category: "article",
    author: "Claire Dupont, ESG Advisory Lead",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    tags: ["ESG", "Corporate Governance", "Regulatory"],
    readTime: "6 min read",
    featured: false,
    published: true,
    createdAt: "2026-02-18T16:20:00Z",
    updatedAt: "2026-02-18T16:20:00Z"
  }
];

export const INITIAL_EVENTS: Event[] = [
  // OrginTech Events
  {
    id: "event-org-1",
    divisionId: "orgintech",
    title: "Global OrginTech AI & Cloud Hackathon 2026",
    description: "48-hour competitive innovation hackathon. Build next-generation autonomous software agents with mentor support and $50,000 in seed prizes.",
    category: "hackathon",
    eventDate: "2026-11-15T09:00:00Z",
    duration: "48 Hours",
    location: "Virtual & MGSolutions Innovation Hub (Hybrid)",
    isVirtual: true,
    meetingUrl: "https://meet.mgsolutions.com/hackathon-2026",
    speaker: "Dr. Jonathan Ross & Cloud Guild Leads",
    speakerRole: "Chief AI Architect",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
    maxAttendees: 500,
    registeredCount: 342,
    status: "upcoming",
    featured: true,
    createdAt: "2026-02-01T09:00:00Z"
  },
  {
    id: "event-org-2",
    divisionId: "orgintech",
    title: "Deploying Edge AI Infrastructure at Enterprise Scale",
    description: "Technical deep-dive on running quantized LLMs on heterogeneous edge nodes with zero latency and fallback clusters.",
    category: "webinar",
    eventDate: "2026-11-20T17:00:00Z",
    duration: "90 Minutes",
    location: "Live Stream Interactive Webinar",
    isVirtual: true,
    meetingUrl: "https://meet.mgsolutions.com/edge-ai-webinar",
    speaker: "Maya Lin",
    speakerRole: "Principal Systems Engineer",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    maxAttendees: 250,
    registeredCount: 188,
    status: "upcoming",
    featured: false,
    createdAt: "2026-02-10T14:00:00Z"
  },

  // EdTech Events
  {
    id: "event-ed-1",
    divisionId: "edtech",
    title: "Full-Stack Cloud Native Developer Immersion Bootcamp",
    description: "Intensive 4-week weekend bootcamp covering Next.js App Router, Docker, Kubernetes, and enterprise microservices.",
    category: "bootcamp",
    eventDate: "2026-11-08T10:00:00Z",
    duration: "4 Weeks (Sat & Sun)",
    location: "Online Interactive Cohort",
    isVirtual: true,
    meetingUrl: "https://meet.mgsolutions.com/edtech-bootcamp-nov",
    speaker: "Priya Nair & Senior Mentors",
    speakerRole: "Director of Curriculum",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    maxAttendees: 120,
    registeredCount: 114,
    status: "upcoming",
    featured: true,
    createdAt: "2026-02-05T10:00:00Z"
  },
  {
    id: "event-ed-2",
    divisionId: "edtech",
    title: "Breaking into Tech: System Design for Staff Engineers",
    description: "Master real-world distributed architectures: partitioning, idempotency, caching hierarchies, and live interview simulation.",
    category: "workshop",
    eventDate: "2026-11-25T18:00:00Z",
    duration: "2 Hours",
    location: "MGSolutions Virtual Auditorium",
    isVirtual: true,
    meetingUrl: "https://meet.mgsolutions.com/system-design-live",
    speaker: "David Kim",
    speakerRole: "Former VP Engineering & EdTech Fellow",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    maxAttendees: 300,
    registeredCount: 245,
    status: "upcoming",
    featured: false,
    createdAt: "2026-02-15T11:00:00Z"
  },

  // BBS Events
  {
    id: "event-bbs-1",
    divisionId: "bbs",
    title: "Executive Business Summit 2026: The Future of Corporate Governance",
    description: "Senior executive roundtable examining macroeconomic shifts, corporate restructuring, and navigating geopolitical supply chains.",
    category: "seminar",
    eventDate: "2026-12-05T13:00:00Z",
    duration: "4 Hours",
    location: "Grand Hyatt Business Center & Virtual Broadcast",
    isVirtual: false,
    meetingUrl: "https://meet.mgsolutions.com/bbs-summit-2026",
    speaker: "Arthur Sterling & Board Advisors",
    speakerRole: "Managing Director, BBS Advisory",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
    maxAttendees: 150,
    registeredCount: 130,
    status: "upcoming",
    featured: true,
    createdAt: "2026-02-08T12:00:00Z"
  },
  {
    id: "event-bbs-2",
    divisionId: "bbs",
    title: "Optimizing OpEx through AI-Powered Process Automation",
    description: "Practical strategies for CFOs and COOs to streamline shared services and finance workflows using intelligent automation.",
    category: "webinar",
    eventDate: "2026-11-18T15:00:00Z",
    duration: "75 Minutes",
    location: "BBS Executive Digital Studio",
    isVirtual: true,
    meetingUrl: "https://meet.mgsolutions.com/bbs-opex-automation",
    speaker: "Claire Dupont",
    speakerRole: "Partner, Operational Transformation",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    maxAttendees: 200,
    registeredCount: 162,
    status: "upcoming",
    featured: false,
    createdAt: "2026-02-12T16:00:00Z"
  }
];

export const INITIAL_REGISTRATIONS: EventRegistration[] = [
  {
    id: "reg-1",
    eventId: "event-org-1",
    eventTitle: "Global OrginTech AI & Cloud Hackathon 2026",
    divisionId: "orgintech",
    userId: "user-student-1",
    userName: "Alex Rivera",
    userEmail: "student@mgsolutions.com",
    userRole: "STUDENT",
    registrationDate: "2026-02-15T12:30:00Z",
    status: "confirmed",
    notes: "Excited to compete in the autonomous agents track."
  },
  {
    id: "reg-2",
    eventId: "event-ed-1",
    eventTitle: "Full-Stack Cloud Native Developer Immersion Bootcamp",
    divisionId: "edtech",
    userId: "user-student-1",
    userName: "Alex Rivera",
    userEmail: "student@mgsolutions.com",
    userRole: "STUDENT",
    registrationDate: "2026-02-16T09:15:00Z",
    status: "confirmed",
    notes: "Preparing for Staff Engineer certifications."
  },
  {
    id: "reg-3",
    eventId: "event-bbs-1",
    eventTitle: "Executive Business Summit 2026: The Future of Corporate Governance",
    divisionId: "bbs",
    userId: "user-student-2",
    userName: "Marcus Chen",
    userEmail: "marcus.chen@outlook.com",
    userRole: "STUDENT",
    registrationDate: "2026-02-22T14:45:00Z",
    status: "confirmed",
    notes: "Attending as part of MBA corporate thesis."
  }
];

export const INITIAL_ENROLLMENTS: CourseEnrollment[] = [
  {
    id: "enr-1",
    userId: "user-student-1",
    courseId: "content-ed-1",
    courseTitle: "Full-Stack Distributed Systems Engineering Masterclass",
    divisionId: "edtech",
    progress: 68,
    enrolledAt: "2026-01-20T10:00:00Z",
    lastActivityAt: "2026-10-25T16:20:00Z"
  },
  {
    id: "enr-2",
    userId: "user-student-1",
    courseId: "content-ed-2",
    courseTitle: "Enterprise Cloud & DevOps Architect Certification Track",
    divisionId: "edtech",
    progress: 35,
    enrolledAt: "2026-02-05T14:00:00Z",
    lastActivityAt: "2026-10-27T11:40:00Z"
  }
];
