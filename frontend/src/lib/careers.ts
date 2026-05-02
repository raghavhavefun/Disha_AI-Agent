export interface Career {
  id: string;
  name: string;
  category: string;
  description: string;
  keywords: string[]; // Added for better semantic matching
}

export const CAREER_DATABASE: Career[] = [
  // Technology - Software & AI
  { id: "swe", name: "Software Engineer", category: "Technology", description: "Build software applications and systems", keywords: ["programming", "coding", "java", "python", "c++", "developer"] },
  { id: "frontend", name: "Frontend Developer", category: "Technology", description: "Create user interfaces and web experiences", keywords: ["react", "web", "html", "css", "javascript", "ui", "ux"] },
  { id: "backend", name: "Backend Developer", category: "Technology", description: "Build server-side systems and APIs", keywords: ["node", "python", "database", "api", "server", "cloud"] },
  { id: "fullstack", name: "Full Stack Developer", category: "Technology", description: "Work on both frontend and backend", keywords: ["web", "mern", "application", "developer"] },
  { id: "mobile", name: "Mobile App Developer", category: "Technology", description: "Build iOS and Android applications", keywords: ["swift", "kotlin", "react native", "flutter", "ios", "android"] },
  { id: "data-sci", name: "Data Scientist", category: "Data & AI", description: "Analyze data and build ML models", keywords: ["statistics", "machine learning", "ai", "r", "python", "big data"] },
  { id: "data-analyst", name: "Data Analyst", category: "Data & AI", description: "Extract insights from data for business decisions", keywords: ["excel", "sql", "tableau", "visualization", "business intelligence"] },
  { id: "ml-eng", name: "ML Engineer", category: "Data & AI", description: "Deploy machine learning systems at scale", keywords: ["pytorch", "tensorflow", "deep learning", "neural networks"] },
  { id: "ai-eng", name: "AI Engineer", category: "Data & AI", description: "Build AI-powered products and features", keywords: ["llm", "generative ai", "nlp", "computer vision"] },
  { id: "devops", name: "DevOps Engineer", category: "Technology", description: "Manage infrastructure and deployment pipelines", keywords: ["docker", "kubernetes", "aws", "automation", "cicd"] },
  { id: "cloud", name: "Cloud Architect", category: "Technology", description: "Design cloud infrastructure solutions", keywords: ["azure", "gcp", "serverless", "distributed systems"] },
  { id: "cybersec", name: "Cybersecurity Analyst", category: "Technology", description: "Protect systems from security threats", keywords: ["hacking", "security", "firewall", "encryption", "network"] },
  { id: "blockchain", name: "Blockchain Developer", category: "Technology", description: "Build decentralized applications", keywords: ["solidity", "ethereum", "crypto", "smart contracts"] },
  { id: "qa", name: "QA Engineer", category: "Technology", description: "Test and ensure software quality", keywords: ["automation", "testing", "selenium", "bug fixing"] },
  { id: "game-dev", name: "Game Developer", category: "Creative Tech", description: "Create video games and interactive experiences", keywords: ["unity", "unreal", "c#", "graphics", "indie game"] },

  // Design & Creative
  { id: "ui-ux", name: "UI/UX Designer", category: "Design", description: "Design user-friendly digital products", keywords: ["figma", "wireframe", "user research", "prototyping"] },
  { id: "graphic", name: "Graphic Designer", category: "Design", description: "Create visual content for brands and media", keywords: ["photoshop", "illustrator", "branding", "logo", "typography"] },
  { id: "product-design", name: "Product Designer", category: "Design", description: "Shape the entire product experience", keywords: ["industrial design", "hardware", "user centric"] },
  { id: "motion", name: "Motion Designer", category: "Design", description: "Create animations and visual effects", keywords: ["after effects", "animation", "video production"] },
  { id: "brand", name: "Brand Designer", category: "Design", description: "Build visual identities for companies", keywords: ["identity", "marketing", "visual strategy"] },
  { id: "interior", name: "Interior Designer", category: "Architecture", description: "Design functional and beautiful spaces", keywords: ["home decor", "architecture", "spatial planning"] },
  { id: "fashion", name: "Fashion Designer", category: "Arts & Fashion", description: "Create clothing and fashion collections", keywords: ["textile", "apparel", "styling", "trends"] },

  // Business, Finance & Management
  { id: "product-mgr", name: "Product Manager", category: "Management", description: "Lead product strategy and development", keywords: ["agile", "scrum", "roadmap", "strategy", "user needs"] },
  { id: "project-mgr", name: "Project Manager", category: "Management", description: "Plan and execute complex projects", keywords: ["pmp", "organization", "stakeholder", "timeline"] },
  { id: "business-analyst", name: "Business Analyst", category: "Management", description: "Bridge business needs and technology", keywords: ["requirements", "process improvement", "consulting"] },
  { id: "consultant", name: "Management Consultant", category: "Management", description: "Advise companies on strategy and operations", keywords: ["mckinsey", "strategy", "problem solving", "mbone"] },
  { id: "investment-bank", name: "Investment Banker", category: "Finance", description: "Handle mergers, acquisitions, and capital", keywords: ["m&a", "wall street", "ipo", "valuation"] },
  { id: "ca", name: "Chartered Accountant", category: "Finance", description: "Audit, tax, and financial advisory", keywords: ["accounting", "taxation", "audit", "tally", "gst"] },
  { id: "cs", name: "Company Secretary", category: "Finance & Law", description: "Legal and corporate governance expert", keywords: ["compliance", "board meetings", "regulations"] },
  { id: "financial-analyst", name: "Financial Analyst", category: "Finance", description: "Analyze markets and investments", keywords: ["stocks", "portfolio", "trading", "financial modeling"] },
  { id: "equity-research", name: "Equity Research Analyst", category: "Finance", description: "Research stocks and market trends", keywords: ["securities", "fundamental analysis"] },
  { id: "risk", name: "Risk Analyst", category: "Finance", description: "Assess and manage financial risks", keywords: ["compliance", "insurance", "fraud detection"] },
  { id: "actuary", name: "Actuary", category: "Finance", description: "Analyze financial risk using mathematics", keywords: ["probability", "insurance", "statistics"] },
  { id: "entrepreneur", name: "Entrepreneur / Startup Founder", category: "Management", description: "Build your own company", keywords: ["startup", "business", "innovation", "vc"] },
  { id: "venture-capital", name: "Venture Capitalist", category: "Finance", description: "Invest in early-stage startups", keywords: ["funding", "angel investor", "pitch deck"] },

  // Marketing & Content
  { id: "digital-marketing", name: "Digital Marketing Manager", category: "Marketing", description: "Run online marketing campaigns", keywords: ["ads", "ppc", "growth", "performance marketing"] },
  { id: "seo", name: "SEO Specialist", category: "Marketing", description: "Optimize content for search engines", keywords: ["google search", "ranking", "keywords", "backlinks"] },
  { id: "social-media", name: "Social Media Manager", category: "Marketing", description: "Manage brand presence on social platforms", keywords: ["instagram", "linkedin", "viral", "engagement"] },
  { id: "content-writer", name: "Content Writer", category: "Content", description: "Write articles, blogs, and web content", keywords: ["blogging", "editing", "storytelling"] },
  { id: "copywriter", name: "Copywriter", category: "Content", description: "Write persuasive marketing copy", keywords: ["sales", "advertising", "conversion"] },
  { id: "content-creator", name: "Content Creator / YouTuber", category: "Content", description: "Create and monetize digital content", keywords: ["video", "vlog", "influencer", "streaming"] },
  { id: "pr", name: "Public Relations Specialist", category: "Marketing", description: "Manage public image and media relations", keywords: ["communications", "crisis management", "press release"] },
  { id: "brand-mgr", name: "Brand Manager", category: "Marketing", description: "Build and maintain brand strategy", keywords: ["brand equity", "positioning", "consumer behavior"] },

  // Healthcare & Life Sciences
  { id: "doctor", name: "Doctor (MBBS)", category: "Healthcare", description: "Diagnose and treat medical conditions", keywords: ["medicine", "surgery", "clinic", "hospital"] },
  { id: "specialist-doc", name: "Specialist Physician", category: "Healthcare", description: "Expert in fields like Cardiology, Oncology, etc.", keywords: ["surgeon", "pediatrician", "neurologist"] },
  { id: "dentist", name: "Dentist", category: "Healthcare", description: "Oral healthcare and dental procedures", keywords: ["teeth", "orthodontist", "dental surgery"] },
  { id: "pharmacist", name: "Pharmacist", category: "Healthcare", description: "Dispense medications and advise patients", keywords: ["drugs", "pharma", "chemist"] },
  { id: "physiotherapist", name: "Physiotherapist", category: "Healthcare", description: "Help patients recover physical function", keywords: ["rehab", "sports injury", "physical therapy"] },
  { id: "psychologist", name: "Clinical Psychologist", category: "Healthcare", description: "Assess and treat mental health conditions", keywords: ["therapy", "counseling", "mental health", "psychiatry"] },
  { id: "nurse", name: "Nurse", category: "Healthcare", description: "Provide patient care in medical settings", keywords: ["hospital", "patient support", "medical care"] },
  { id: "biotech", name: "Biotechnologist", category: "Life Sciences", description: "Apply biology to develop products and tech", keywords: ["genetics", "lab", "vaccines", "research"] },
  { id: "bioinfo", name: "Bioinformatician", category: "Life Sciences", description: "Analyze biological data using computation", keywords: ["genomics", "dna", "computational biology"] },

  // Law, Government & Civil Services (Indian & Global)
  { id: "lawyer", name: "Lawyer / Advocate", category: "Law", description: "Practice law and represent clients", keywords: ["litigation", "court", "legal advice"] },
  { id: "corporate-law", name: "Corporate Lawyer", category: "Law", description: "Handle business and corporate legal matters", keywords: ["contracts", "mergers", "compliance"] },
  { id: "ias", name: "IAS Officer (Civil Services)", category: "Government", description: "Administrative leadership in government", keywords: ["upsc", "administration", "civil service", "collector"] },
  { id: "ips", name: "IPS Officer", category: "Government", description: "Lead law enforcement and policing", keywords: ["upsc", "police", "security", "dsp"] },
  { id: "irs", name: "IRS Officer", category: "Government", description: "Revenue and taxation administration", keywords: ["upsc", "customs", "income tax"] },
  { id: "ssc", name: "SSC/Bank PO", category: "Government", description: "Government and banking sector roles", keywords: ["cgl", "banking", "ibps", "clerk", "officer"] },
  { id: "diplomat", name: "Diplomat / IFS Officer", category: "Government", description: "Represent the country internationally", keywords: ["foreign service", "ambassador", "embassy"] },

  // Engineering & Core Science
  { id: "mech-eng", name: "Mechanical Engineer", category: "Engineering", description: "Design and build mechanical systems", keywords: ["machines", "automotive", "cad", "thermodynamics"] },
  { id: "civil-eng", name: "Civil Engineer", category: "Engineering", description: "Design infrastructure and construction", keywords: ["buildings", "bridges", "roads", "structural"] },
  { id: "elec-eng", name: "Electrical Engineer", category: "Engineering", description: "Work with electrical systems and power", keywords: ["circuits", "power grid", "electronics"] },
  { id: "chem-eng", name: "Chemical Engineer", category: "Engineering", description: "Design chemical manufacturing processes", keywords: ["refinery", "polymers", "industrial chemistry"] },
  { id: "aero-eng", name: "Aerospace Engineer", category: "Engineering", description: "Design aircraft and spacecraft", keywords: ["nasa", "isro", "planes", "rockets"] },
  { id: "robotics", name: "Robotics Engineer", category: "Engineering", description: "Build and program robotic systems", keywords: ["automation", "ai", "hardware", "mechatronics"] },
  { id: "nuclear-eng", name: "Nuclear Engineer", category: "Engineering", description: "Work with nuclear energy and processes", keywords: ["reactors", "physics", "radiation"] },

  // Media, Arts & Hospitality
  { id: "journalist", name: "Journalist", category: "Media", description: "Report news and write stories", keywords: ["reporting", "news", "investigative", "media"] },
  { id: "filmmaker", name: "Filmmaker / Director", category: "Media", description: "Create films and video content", keywords: ["cinema", "direction", "screenwriting", "bollywood"] },
  { id: "photographer", name: "Photographer", category: "Media", description: "Capture professional photographs", keywords: ["visuals", "camera", "fashion photography", "travel"] },
  { id: "video-editor", name: "Video Editor", category: "Media", description: "Edit and produce video content", keywords: ["premiere pro", "final cut", "post production"] },
  { id: "animator", name: "Animator / VFX Artist", category: "Media", description: "Create animations and visual effects", keywords: ["3d", "maya", "cgi", "movies"] },
  { id: "musician", name: "Musician / Music Producer", category: "Arts", description: "Create and produce music", keywords: ["composer", "singer", "audio engineer"] },
  { id: "writer", name: "Author / Novelist", category: "Arts", description: "Write books and literary works", keywords: ["literature", "publishing", "fiction"] },
  { id: "chef", name: "Executive Chef", category: "Hospitality", description: "Lead kitchen operations and culinary design", keywords: ["cooking", "hotel management", "culinary arts"] },
  { id: "hotel-mgr", name: "Hotel Manager", category: "Hospitality", description: "Oversee hotel operations", keywords: ["tourism", "guest relations", "management"] },

  // Education & HR
  { id: "teacher", name: "Teacher / Professor", category: "Education", description: "Educate and mentor students", keywords: ["school", "college", "teaching", "research"] },
  { id: "researcher", name: "Research Scientist", category: "Science", description: "Conduct academic or industry research", keywords: ["phd", "papers", "discovery", "lab"] },
  { id: "ed-tech", name: "EdTech Professional", category: "Education", description: "Build educational technology products", keywords: ["e-learning", "curriculum", "instructional design"] },
  { id: "hr", name: "HR Manager", category: "Management", description: "Manage people, hiring, and culture", keywords: ["recruitment", "human resources", "talent acquisition"] },

  // Emerging & Specialized
  { id: "ev", name: "EV / Clean Energy Engineer", category: "Sustainability", description: "Work on electric vehicles and clean energy", keywords: ["tesla", "batteries", "renewable energy", "solar"] },
  { id: "ar-vr", name: "AR/VR Developer", category: "Creative Tech", description: "Build augmented and virtual reality experiences", keywords: ["metaverse", "extended reality", "spatial computing"] },
  { id: "iot", name: "IoT Developer", category: "Technology", description: "Build connected device systems", keywords: ["smart home", "sensors", "embedded systems"] },
  { id: "quant", name: "Quantitative Analyst", category: "Finance", description: "Use math and code for trading strategies", keywords: ["algorithms", "math", "hedge fund"] },
  { id: "prompt-eng", name: "AI Prompt Engineer", category: "Data & AI", description: "Design and optimize AI system prompts", keywords: ["chatgpt", "midjourney", "prompt design"] },
  { id: "sustainability", name: "Sustainability Consultant", category: "Sustainability", description: "Help companies go green", keywords: ["esg", "environment", "carbon footprint"] },
  { id: "urban-planner", name: "Urban Planner", category: "Architecture", description: "Design city layouts and infrastructure", keywords: ["smart cities", "public policy", "spatial design"] },
  { id: "pilot", name: "Commercial Pilot", category: "Aviation", description: "Fly commercial aircraft", keywords: ["aviation", "flying", "airlines"] },
  { id: "astronomer", name: "Astronomer / Astrophysicist", category: "Science", description: "Study stars, planets, and the universe", keywords: ["space", "telescope", "physics", "cosmology"] },
  { id: "marine-bio", name: "Marine Biologist", category: "Science", description: "Study ocean life and ecosystems", keywords: ["ocean", "underwater", "conservation"] },
  { id: "archaeologist", name: "Archaeologist", category: "History", description: "Study human history through excavation", keywords: ["history", "digging", "artifacts", "heritage"] },
  { id: "sports-mgr", name: "Sports Manager", category: "Sports", description: "Manage sports teams or athletes", keywords: ["athletics", "coaching", "sports marketing"] },
];

export const CAREER_CATEGORIES = ["All", ...new Set(CAREER_DATABASE.map(c => c.category))].sort();
