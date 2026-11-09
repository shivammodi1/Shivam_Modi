// Portfolio content shown inside the game lobby and main menu.

export type StationId = "projects" | "arsenal" | "trophies" | "profile" | "comms" | "career" | "ranked";

export const STATIONS: { id: StationId; key: string; label: string; hint: string }[] = [
  { id: "projects", key: "1", label: "Projects", hint: "Gallery · back wall" },
  { id: "arsenal", key: "2", label: "Arsenal", hint: "Skills · left wall" },
  { id: "trophies", key: "3", label: "Trophies", hint: "Certificates · right wall" },
  { id: "profile", key: "4", label: "Agent", hint: "About · centre hologram" },
  { id: "comms", key: "5", label: "Comms", hint: "Contact · terminal near spawn" },
  { id: "career", key: "6", label: "Career", hint: "Internship · behind spawn, right" },
  { id: "ranked", key: "7", label: "Ranked", hint: "Coding profiles · behind spawn, left" },
];

export interface Experience {
  role: string;
  company: string;
  companyUrl: string;
  /** ISO date; the duration shown is computed from this. */
  start: string;
  end: string | null;
  summary: string;
  stack: string[];
}

export const EXPERIENCE: Experience[] = [
  {
    role: "SDE Intern",
    company: "PlatinumRx",
    companyUrl: "https://www.platinumrx.in/",
    start: "2026-06-15",
    end: null,
    summary: "Backend engineering for an online pharmacy. Built Vantage, a logistics-escalation platform that catches delivery-SLA breaches and routes delayed orders to agent calling queues, automated carrier RTO follow-ups via ClickPost, and built warehouse gatepass and GRN flows integrated with Zoho Books.",
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Redis", "TypeORM"],
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Jun 2026 – Present · 5 mos" */
export function formatTenure(start: string, end: string | null, now = new Date()) {
  const s = new Date(start);
  const e = end ? new Date(end) : now;
  const months = Math.max(1, (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth() + (e.getDate() >= s.getDate() ? 1 : 0));
  const label = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  const span = months >= 12 ? `${Math.floor(months / 12)} yr${months % 12 ? ` ${months % 12} mos` : ""}` : `${months} mo${months > 1 ? "s" : ""}`;
  return `${label(s)} – ${end ? label(e) : "Present"} · ${span}`;
}

export const HANDLES = {
  github: "shivammodi1",
  leetcode: "shivam-modi001",
  gfg: "smodi9kat",
  codechef: "shivammodi001",
};

/** Shown until live numbers arrive, and kept for sources with no browser-readable API (GFG, CodeChef). */
export const STATS_SNAPSHOT = {
  asOf: "Nov 2026",
  leetcode: { solved: 533, easy: 321, medium: 185, hard: 27, ranking: 190985, activeDays: 142, streak: 37 },
  gfg: { solved: 257, score: 866, instituteRank: 1201 },
  codechef: { solved: 426 },
  github: { repoCount: 43, followers: 8, contributionsLastYear: 945 },
};

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  image: string;
  category: string;
}

export const PROJECTS: Project[] = [
  { title: "FoodHub", description: "Full MERN food ordering platform with authentication, order tracking, and secure payment integration.", technologies: ["MongoDB", "Express", "React", "Node.js", "Tailwind"], githubUrl: "https://github.com/shivammodi1/FoodHub", liveUrl: "https://foodhub-frontend-yl92.onrender.com/", image: "/foodhub.png", category: "Full Stack" },
  { title: "EliteCode", description: "Online competitive coding platform with problem submission, live judging, and user skill tracking.", technologies: ["React", "Node.js", "MongoDB", "Express"], githubUrl: "https://github.com/shivammodi1/EliteCode", image: "/elitecode.png", category: "Full Stack" },
  { title: "Socket Chat", description: "Real-time chat with WebSockets, multi-user rooms, online presence indicators, and message history.", technologies: ["React", "Node.js", "Socket.io", "MongoDB"], githubUrl: "https://github.com/shivammodi1/chat-app", liveUrl: "https://chat-app-epcp.onrender.com/", image: "/socket-chat.png", category: "Real-time" },
  { title: "Virtual Assistant", description: "AI-powered assistant with voice recognition, text-to-speech, and Gemini AI command handling.", technologies: ["React", "Express", "MongoDB", "Gemini AI"], githubUrl: "https://github.com/shivammodi1/Virtual-Assistance", liveUrl: "https://virtual-assistance-y2eo.onrender.com/", image: "/virtualAssistant.png", category: "AI/ML" },
  { title: "Swiggy Clone", description: "Feature-rich food delivery app with restaurant listings, cart, and checkout, inspired by Swiggy.", technologies: ["React", "Redux", "Firebase", "Tailwind"], githubUrl: "https://github.com/shivammodi1/Swiggy_Clone", liveUrl: "https://swiggy-clone-orpin.vercel.app/", image: "/swiggy-clone.png", category: "Frontend" },
  { title: "YouTube Clone", description: "Video streaming platform replicating YouTube features: search, likes, comments, and responsive UI.", technologies: ["React", "TypeScript", "YouTube API", "Tailwind"], githubUrl: "https://github.com/shivammodi1/youtube_clone", image: "/youtube-clone.png", category: "Frontend" },
  { title: "Agri ChatBot", description: "AI chatbot for farmers providing crop tips, weather updates, and farming guidance in regional languages.", technologies: ["Python", "Flask", "Dialogflow", "MongoDB"], githubUrl: "https://github.com/shivammodi1/Agri_Help", liveUrl: "https://shivammodi1.github.io/Agri_Help/", image: "/agri-chatbot.png", category: "AI/ML" },
  { title: "TicTacToe", description: "Multiplayer TicTacToe with interactive animations and smart game logic implementation.", technologies: ["HTML", "CSS", "JavaScript"], githubUrl: "https://github.com/shivammodi1/TicTacToe", liveUrl: "https://shivammodi1.github.io/TicTacToe/", image: "/tictactoe.png", category: "Game" },
  { title: "Calculator", description: "Clean, modern calculator with all arithmetic operations and a polished, responsive interface.", technologies: ["HTML", "CSS", "JavaScript"], githubUrl: "https://github.com/shivammodi1/Calculator", liveUrl: "https://shivammodi1.github.io/Calculator/", image: "/calculator.png", category: "Utility" },
];

export const SKILL_LOADOUT = [
  { title: "Frontend", weapon: "Vandal", skills: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Tailwind CSS"] },
  { title: "Backend", weapon: "Phantom", skills: ["Node.js", "Express.js", "Python", "REST APIs"] },
  { title: "Databases", weapon: "Guardian", skills: ["MongoDB", "MySQL", "Mongoose"] },
  { title: "Languages", weapon: "Operator", skills: ["JavaScript", "TypeScript", "Python", "C", "C++"] },
  { title: "Tools & Cloud", weapon: "Spectre", skills: ["Git", "VS Code", "AWS Basics", "Render", "Vercel", "Netlify"] },
  { title: "Security & OS", weapon: "Sheriff", skills: ["Linux/Ubuntu", "Cybersecurity", "Kali Linux"] },
];

export const PROFICIENCIES = [
  { skill: "Frontend", detail: "React, JS, Tailwind", level: 90 },
  { skill: "Languages", detail: "C, C++, Python", level: 85 },
  { skill: "Backend", detail: "Node, Express, Python", level: 80 },
  { skill: "Databases", detail: "MongoDB, MySQL", level: 75 },
  { skill: "TypeScript", detail: "Typed React & Node", level: 70 },
  { skill: "Cloud & DevTools", detail: "AWS, Git, Vercel", level: 65 },
  { skill: "Linux & Security", detail: "Kali, Ubuntu", level: 60 },
];

export const LEARNING = ["Next.js", "DSA", "Blockchain"];

export interface Cert {
  title: string;
  issuer: string;
  date: string;
  badge: string;
  summary: string;
  skills: string[];
  url?: string;
  featured?: boolean;
}

export const CERTS: Cert[] = [
  { title: "Winner – Paranox 2.0 National Hackathon", issuer: "Newton School of Technology, Sonipat", date: "Nov 2025", badge: "Winner", summary: "Won a national grand-finale hackathon against teams from colleges across India with a full-stack solution built under pressure.", skills: ["Innovation", "Full Stack", "Team Lead", "Rapid Prototyping"], url: "https://www.linkedin.com/posts/shivammodi1_paranox2-winner-nationalhackathon-activity-7396210919103512576-uDhU", featured: true },
  { title: "Oracle Certified Professional – GenAI", issuer: "Oracle University", date: "2025", badge: "AI / ML", summary: "Generative AI concepts, prompt engineering and AI solution architecture on Oracle Cloud.", skills: ["Generative AI", "Oracle Cloud", "LLMs", "AI Architecture"], url: "https://drive.google.com/file/d/1u5FC3Vt5swKx4wPSspjn7LN56kweYjfr/view?usp=sharing" },
  { title: "Certified Ethical Hacker (CEH) V12", issuer: "Warlock Security", date: "2024", badge: "Security", summary: "Penetration testing, network recon, vulnerability exploitation and ethical hacking methodology.", skills: ["Ethical Hacking", "Pen Testing", "Network Security", "Vulnerability Assessment"], url: "https://drive.google.com/file/d/17xDK2jk36yRt_b2a2rSz3sa5o1mgdzdA/view?usp=sharing" },
  { title: "Full-Stack Web Development", issuer: "University Coursework", date: "2023", badge: "Full Stack", summary: "React frontends, Node.js + Express APIs and MongoDB, building real MERN applications.", skills: ["React", "Node.js", "MongoDB", "Express"] },
  { title: "Data Structures & Algorithms", issuer: "University Coursework", date: "2023", badge: "CS Core", summary: "Arrays, trees, graphs, dynamic programming, sorting and complexity analysis.", skills: ["DSA", "Algorithms", "Problem Solving", "Optimization"] },
];

export const CODING_PROFILES = [
  { name: "LeetCode", url: "https://leetcode.com/u/shivam-modi001/" },
  { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/user/smodi9kat/" },
  { name: "CodeChef", url: "https://www.codechef.com/users/shivammodi001" },
  { name: "GitHub", url: "https://github.com/shivammodi1" },
];

export const PROFILE = {
  name: "Shivam Modi",
  role: "Full-Stack Developer",
  agentClass: "Duelist",
  origin: "Lucknow, India",
  bio: [
    "3rd year B.Tech CSE at Lovely Professional University, driven by building things that actually work and look great doing it.",
    "Started with curiosity about why software feels the way it does, which led deep into full-stack development: the precision of backend systems and the craft of frontend experiences.",
    "Beyond code, actively involved in NGO work, building tools for social good.",
    "Competes in hackathons (won Paranox 2.0), contributes to open source, and is diving into DSA, Next.js and blockchain.",
  ],
  stats: [
    { value: "9+", label: "Projects" },
    { value: "5", label: "Certificates" },
    { value: "1", label: "National win" },
  ],
  education: [
    { degree: "B.Tech Computer Science Engineering", school: "Lovely Professional University", period: "2023 – Present · 3rd Year" },
    { degree: "Class 12th — PCM + CS", school: "Mahatma Buddha Memorial Inter College", period: "85% Marks" },
  ],
};

export const CONTACT = {
  email: "smodi9846@gmail.com",
  phone: "+91 7860559651",
  location: "Lucknow, Uttar Pradesh",
  resume: "/resume.pdf",
  socials: [
    { label: "GitHub", handle: "@shivammodi1", url: "https://github.com/shivammodi1" },
    { label: "LinkedIn", handle: "shivammodi1", url: "https://www.linkedin.com/in/shivammodi1/" },
    { label: "Instagram", handle: "@9249.shivam", url: "https://www.instagram.com/9249.shivam/" },
  ],
};
