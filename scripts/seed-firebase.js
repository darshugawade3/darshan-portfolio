// scripts/seed-firebase.js
// ─────────────────────────────────────────────────────────────
// Run: node scripts/seed-firebase.js
// This seeds initial data for Darshan's portfolio into Firestore
// ─────────────────────────────────────────────────────────────

const { initializeApp } = require("firebase/app");
const { getFirestore, setDoc, addDoc, collection, doc } = require("firebase/firestore");

// Paste your firebaseConfig here from .env.local values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("🌱 Seeding Firestore with initial data...");

  // ── Profile ──
  await setDoc(doc(db, "config", "profile"), {
    name: "Darshan Suresh Gawade",
    title: "B.Pharm Student | Pharmaceutical Researcher | Healthcare Data Analyst | Data Visualization Enthusiast",
    bio: "Pharmaceutical Research | Healthcare Analytics | Data Science",
    about: "A motivated Bachelor of Pharmacy student with hands-on experience in herbal drug research, phytochemical screening, anti-urolithiatic studies, healthcare analytics, data visualization, and database management. Skilled in Advanced Excel, Power BI, Oracle SQL, Python, and scientific research documentation. Passionate about integrating pharmaceutical sciences with data-driven healthcare solutions.",
    objective: "To leverage pharmaceutical knowledge and data analytics skills to contribute meaningfully to healthcare research and pharmaceutical industry.",
    photoURL: "",
    email: "darshhugawade3@gmail.com",
    phone: "8956875201",
    location: "Dhule, Maharashtra, India",
    linkedin: "https://www.linkedin.com/in/darshan-gawade-3646bb406/",
    github: "",
    resumeURL: "",
    resumeName: "",
    visitorCount: 0,
    downloadCount: 0,
    updatedAt: new Date().toISOString(),
  });
  console.log("✅ Profile seeded");

  // ── Education ──
  const educationData = [
    {
      degree: "Bachelor of Pharmacy (B.Pharm)",
      field: "Pharmacy",
      institute: "Sanjay Education Society College of Pharmacy, Navalnagar, Dhule",
      university: "Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere",
      startYear: "2022",
      endYear: "2026",
      grade: "Expected 2026",
      achievements: [
        "Final Year Project: Phytochemical Screening of Bryophyllum pinnatum",
        "Healthcare Analytics: Patient Dropout Intelligence System",
        "Active member of Pharmacy research team",
      ],
      order: 0,
      current: true,
    },
    {
      degree: "Diploma in Pharmacy (D.Pharm)",
      field: "Pharmacy",
      institute: "SVKM Institute of Pharmacy, Dhule",
      university: "Maharashtra State Board of Technical Education",
      startYear: "2020",
      endYear: "2022",
      grade: "First Class",
      achievements: ["Completed with First Class distinction"],
      order: 1,
      current: false,
    },
  ];
  for (const edu of educationData) {
    await addDoc(collection(db, "education"), edu);
  }
  console.log("✅ Education seeded");

  // ── Skills ──
  const skillsData = [
    { name: "Python", level: 72, category: "programming", order: 0 },
    { name: "Oracle SQL", level: 70, category: "programming", order: 1 },
    { name: "C Programming", level: 60, category: "programming", order: 2 },
    { name: "Advanced Excel", level: 88, category: "analytics", order: 3 },
    { name: "Power BI", level: 80, category: "analytics", order: 4 },
    { name: "Data Visualization", level: 82, category: "analytics", order: 5 },
    { name: "Healthcare Analytics", level: 78, category: "analytics", order: 6 },
    { name: "Phytochemical Screening", level: 90, category: "research", order: 7 },
    { name: "Pharmaceutical Research", level: 88, category: "research", order: 8 },
    { name: "Scientific Documentation", level: 85, category: "research", order: 9 },
    { name: "Microsoft Office", level: 92, category: "professional", order: 10 },
    { name: "PowerPoint", level: 88, category: "professional", order: 11 },
    { name: "AI Tools", level: 78, category: "professional", order: 12 },
    { name: "Report Writing", level: 87, category: "professional", order: 13 },
  ];
  for (const skill of skillsData) {
    await addDoc(collection(db, "skills"), skill);
  }
  console.log("✅ Skills seeded");

  // ── Projects ──
  const projectsData = [
    {
      title: "Phytochemical Screening and In-Vitro Anti-Urolithiatic Activity of Bryophyllum pinnatum Extract",
      subtitle: "Herbal Syrup Formulation and Evaluation — B.Pharm Final Year Project",
      description: "Comprehensive research on phytochemical profile and anti-urolithiatic potential of Bryophyllum pinnatum.",
      longDescription: "A comprehensive B.Pharm final-year research project investigating the phytochemical profile and anti-urolithiatic potential of Bryophyllum pinnatum (Patharchatta). The study involved successive solvent extraction, phytochemical screening, herbal syrup formulation, and in-vitro evaluation of inhibitory activity against calcium oxalate crystal growth — a primary component of kidney stones.",
      tags: ["Phytochemistry", "Herbal Research", "Anti-Urolithiatic", "Formulation", "B.Pharm"],
      color: "cyan",
      icon: "🧪",
      featured: true,
      order: 0,
      status: "completed",
      startDate: "2024-06",
      endDate: "2025-04",
      objectives: [
        "Authenticate Bryophyllum pinnatum plant material",
        "Perform successive solvent extraction (petroleum ether, ethanol, water)",
        "Conduct preliminary phytochemical screening for alkaloids, flavonoids, tannins, saponins, glycosides",
        "Evaluate in-vitro anti-urolithiatic activity using calcium oxalate crystallization inhibition assay",
        "Formulate and evaluate a herbal syrup using standardized extract",
      ],
      methodology: "Plant material was collected from Dhule region, authenticated, and dried. Successive extraction was performed using petroleum ether, ethanol, and distilled water. Standard qualitative phytochemical tests were performed. Anti-urolithiatic activity was assessed using the calcium oxalate crystallization inhibition assay at varying concentrations.",
      results: "Ethanolic extract showed the highest phytochemical content including alkaloids, flavonoids, tannins, and saponins. Anti-urolithiatic activity was dose-dependent with maximum inhibition at 800 µg/mL. The herbal syrup passed all evaluation parameters: pH 6.2, viscosity within range, specific gravity 1.18, and microbial limit tests.",
      futureScope: "Future studies should investigate in-vivo anti-urolithiatic activity in animal models, conduct clinical trials, explore nano-formulation of the extract, and develop standardized herbal dosage forms for commercial production.",
      technologies: ["Phytochemistry", "Spectrophotometry", "HPLC", "Herbal Formulation"],
      images: [],
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Patient Dropout Intelligence System",
      subtitle: "Healthcare Analytics & Clinical Trial Risk Management",
      description: "Healthcare intelligence solution for identifying patients at risk of treatment dropout across 8 Indian clinical trial sites.",
      longDescription: "A comprehensive healthcare intelligence solution for identifying patients at risk of treatment dropout across 8 Indian clinical trial sites. Built using a 5,000-patient dataset with advanced analytics pipelines, interactive Power BI dashboards with DAX measures, predictive risk scoring, and automated reporting — reducing manual reporting time by 70%.",
      tags: ["Python", "Power BI", "Oracle SQL", "Advanced Excel", "Healthcare Analytics", "Clinical Trials"],
      color: "gold",
      icon: "📊",
      featured: true,
      order: 1,
      status: "completed",
      startDate: "2024-10",
      endDate: "2025-02",
      objectives: [
        "Identify patients at high risk of clinical trial dropout",
        "Build interactive Power BI dashboards for real-time site monitoring",
        "Develop automated data cleaning pipelines using Python",
        "Create predictive risk scoring model",
        "Automate reporting for CRO teams",
      ],
      methodology: "Dataset of 5,000 patients across 8 Indian trial sites was collected and cleaned using Python (pandas, numpy). Risk factors were identified using statistical analysis and correlation studies. Power BI dashboards were developed with complex DAX measures for real-time filtering, pagination, and drill-through analytics.",
      results: "Successfully identified top dropout risk factors including missed visits (>2), age group 45-60, and sites in Tier-2 cities. Dashboard reduced manual reporting time by 70%. Predictive model achieved 84% accuracy. Excel dashboard created as secondary reporting tool.",
      futureScope: "Integration with EDC systems, real-time ML prediction using LSTM models, mobile dashboard for site coordinators, and automated email alerts for high-risk patients.",
      technologies: ["Python", "Pandas", "Oracle SQL", "Power BI", "DAX", "Advanced Excel", "Healthcare Analytics"],
      images: [],
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  for (const project of projectsData) {
    await addDoc(collection(db, "projects"), project);
  }
  console.log("✅ Projects seeded");

  // ── Achievements ──
  const achievementsData = [
    { title: "B.Pharm Final Year Research", description: "Completed comprehensive phytochemical research project on Bryophyllum pinnatum", category: "Research", year: "2025", icon: "🔬", order: 0 },
    { title: "Healthcare Analytics Project", description: "Built Patient Dropout Intelligence System for 8 clinical trial sites with 5,000-patient dataset", category: "Analytics", year: "2025", icon: "📊", order: 1 },
    { title: "D.Pharm First Class", description: "Completed Diploma in Pharmacy with First Class from SVKM Institute", category: "Academic", year: "2022", icon: "🎓", order: 2 },
  ];
  for (const ach of achievementsData) {
    await addDoc(collection(db, "achievements"), ach);
  }
  console.log("✅ Achievements seeded");

  console.log("\n🎉 All data seeded successfully!");
  console.log("📌 Next step: Go to Firebase Console → Authentication → Add user with your admin email.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
