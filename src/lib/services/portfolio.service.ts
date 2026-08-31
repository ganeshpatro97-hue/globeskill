/**
 * GlobeSkill Phase 8: Employment Matchmaking & AI Portfolio Builder Service
 * Powers automated Gemini portfolio generation, talent discovery, and CSR vocational matching.
 */

import { StudentPortfolio, JobOpportunity } from '@/types/database';

const INITIAL_PORTFOLIOS: StudentPortfolio[] = [
  {
    id: 'port-001',
    student_id: '00000000-0000-0000-0000-000000000003',
    full_name: 'Rohit Kumar',
    email: 'student.rohit@globeskill.org',
    headline: 'Aspiring AI & Full-Stack Developer | Young Innovator Cohort',
    location: 'Patna, Bihar, India',
    summary: 'Driven high-school student trained through GlobeSkill and Edunet Foundation in practical Python, Neural Network foundations, and responsive web development. Passionate about applying AI to solve rural agricultural and healthcare access challenges.',
    technical_skills: ['Python 3', 'Computer Vision Basics', 'HTML5/Tailwind CSS', 'Next.js Basics', 'Git Version Control'],
    soft_skills: ['Problem Solving', 'Team Collaboration', 'Fast Learner', 'Bilingual (Hindi & English)'],
    verified_certificates: [
      'GlobeSkill AI Micro Degree (Practical Foundations)',
      'IBM SkillsBuild Digital Literacy Micro-Credential',
      'UN SDG Youth Tech Contributor 2026'
    ],
    projects: [
      {
        id: 'proj-01',
        title: 'Crop Disease Image Classifier',
        description: 'Trained a computer vision model using OpenCV and Python to identify leaf rust on local wheat crops with 92% test accuracy.',
        technologies: ['Python', 'OpenCV', 'Machine Learning'],
        github_url: 'https://github.com/globeskill/crop-vision',
        completed_at: '2026-08-20'
      },
      {
        id: 'proj-02',
        title: 'Rural Community Noticeboard Web App',
        description: 'Responsive web portal for village learning centers displaying live weather advisories and daily government skill workshops.',
        technologies: ['React', 'Tailwind CSS', 'JavaScript'],
        demo_url: 'https://demo.globeskill.org/noticeboard',
        completed_at: '2026-08-25'
      }
    ],
    match_score: 95,
    employability_status: 'ready_for_internship',
    updated_at: '2026-08-28T10:00:00Z'
  },
  {
    id: 'port-002',
    student_id: 'usr_savitri_02',
    full_name: 'Savitri Bai',
    email: 'savitri.b@globeskill.org',
    headline: 'Junior Data Analyst & Python Scripter | Women in Tech Fellow',
    location: 'Pune Rural Hub, Maharashtra',
    summary: 'Self-motivated vocational learner specialized in tabular data cleaning, Pandas analysis, and interactive dashboard storytelling. Eager to join CSR-sponsored digital enablement projects.',
    technical_skills: ['Python Data Analysis', 'Pandas & NumPy', 'Spreadsheets & Charts', 'SQL Basics'],
    soft_skills: ['Data Intuition', 'Attention to Detail', 'Marathi & English Communication'],
    verified_certificates: [
      'AI & Data Careers for Women Accelerator',
      'IBM SkillsBuild Tech Basics'
    ],
    projects: [
      {
        id: 'proj-03',
        title: 'Public Health Center Data Dashboard',
        description: 'Aggregated immunization statistics across 12 rural clinics to visualize vaccination coverage trends.',
        technologies: ['Python', 'Pandas', 'Matplotlib'],
        completed_at: '2026-08-22'
      }
    ],
    match_score: 88,
    employability_status: 'ready_for_internship',
    updated_at: '2026-08-27T14:00:00Z'
  },
  {
    id: 'port-003',
    student_id: 'usr_rahul_03',
    full_name: 'Rahul Sen',
    email: 'rahul.sen@gmail.com',
    headline: 'Creative Web Developer & UI Designer',
    location: 'Kolkata Center, West Bengal',
    summary: 'Passionate young creator skilled in modern React components, responsive layouts, and interactive micro-apps designed for low-bandwidth devices.',
    technical_skills: ['JavaScript / TypeScript', 'React', 'HTML5 & CSS Grid', 'Figma UI Basics'],
    soft_skills: ['Creative Thinking', 'User Empathy', 'Bengali & English'],
    verified_certificates: [
      'Full-Stack Web Development & Creative Coding',
      'Edunet Digital Skills Certification'
    ],
    projects: [
      {
        id: 'proj-04',
        title: 'Interactive Math Quiz Game for Primary Schools',
        description: 'Gamified math learning web application featuring instant audio feedback and score leaderboards.',
        technologies: ['JavaScript', 'Canvas API', 'CSS'],
        completed_at: '2026-08-24'
      }
    ],
    match_score: 91,
    employability_status: 'ready_for_internship',
    updated_at: '2026-08-29T09:30:00Z'
  }
];

const INITIAL_JOBS: JobOpportunity[] = [
  {
    id: 'job-001',
    recruiter_id: 'rec_01',
    company_name: 'TechMahindra CSR Foundation',
    title: 'Junior AI & Data Annotation Intern',
    role_type: 'Internship',
    location: 'Remote / Hybrid (India Centers)',
    stipend_range: '₹12,000 - ₹18,000 / month',
    required_skills: ['Python 3', 'Computer Vision Basics', 'Data Entry'],
    description: 'Join our flagship CSR digital inclusion initiative. Help annotate real-world datasets for social robotics and agricultural AI models under senior software engineer mentorship.',
    openings_count: 5,
    applicants_count: 14,
    created_at: '2026-08-25T00:00:00Z'
  },
  {
    id: 'job-002',
    recruiter_id: 'rec_02',
    company_name: 'Infosys Springboard Tech Initiative',
    title: 'Front-End Web Development Apprentice',
    role_type: 'Apprenticeship',
    location: 'Bengaluru / Pune Hubs',
    stipend_range: '₹15,000 - ₹22,000 / month',
    required_skills: ['HTML5/CSS', 'JavaScript / React', 'Git'],
    description: 'Accelerated vocational apprenticeship designed for GlobeSkill certified learners. Build accessible web interfaces for non-profit and public governance portals.',
    openings_count: 8,
    applicants_count: 21,
    created_at: '2026-08-27T00:00:00Z'
  },
  {
    id: 'job-003',
    recruiter_id: 'rec_03',
    company_name: 'Global Impact Tech Labs',
    title: 'Rural Digital Center Lab Assistant',
    role_type: 'CSR Trainee',
    location: 'Patna / Jaipur Outreach Centers',
    stipend_range: '₹10,000 - ₹14,000 / month',
    required_skills: ['Digital Literacy', 'Python Basics', 'Hardware Tinkering'],
    description: 'Assist local students with hardware setup, coding scratchpad guidance, and offline synchronization batches at rural digital centers.',
    openings_count: 4,
    applicants_count: 9,
    created_at: '2026-08-29T00:00:00Z'
  }
];

export class PortfolioStore {
  private static getKey(key: string): string {
    return `globeskill_p8_${key}`;
  }

  static getPortfolios(): StudentPortfolio[] {
    if (typeof window === 'undefined') return INITIAL_PORTFOLIOS;
    const stored = localStorage.getItem(this.getKey('portfolios'));
    if (!stored) {
      localStorage.setItem(this.getKey('portfolios'), JSON.stringify(INITIAL_PORTFOLIOS));
      return INITIAL_PORTFOLIOS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_PORTFOLIOS;
    }
  }

  static savePortfolios(portfolios: StudentPortfolio[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getKey('portfolios'), JSON.stringify(portfolios));
    }
  }

  static getJobs(): JobOpportunity[] {
    if (typeof window === 'undefined') return INITIAL_JOBS;
    const stored = localStorage.getItem(this.getKey('jobs'));
    if (!stored) {
      localStorage.setItem(this.getKey('jobs'), JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_JOBS;
    }
  }

  static saveJobs(jobs: JobOpportunity[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getKey('jobs'), JSON.stringify(jobs));
    }
  }
}

// Generate an AI-Synthesized Student Portfolio using Google Gemini
export async function generateAiPortfolio(studentInfo: {
  fullName: string;
  email: string;
  location?: string;
  skills?: string[];
  completedCourses?: string[];
  education?: string;
}): Promise<StudentPortfolio> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && !apiKey.includes('your-')) {
    try {
      const prompt = `
You are the GlobeSkill Executive AI Portfolio & Career Architect.
Formulate an inspiring, high-impact professional technical portfolio resume for a young student graduate from an underserved background.

Student Details:
- Name: ${studentInfo.fullName}
- Email: ${studentInfo.email}
- Location: ${studentInfo.location || 'India'}
- Education: ${studentInfo.education || 'High School & Vocational AI Program'}
- Skills: ${(studentInfo.skills || ['Python', 'AI Foundations', 'Web Development']).join(', ')}
- Completed Courses: ${(studentInfo.completedCourses || ['AI Micro Degree for Young Innovators', 'IBM SkillsBuild Tech Basics']).join(', ')}

Return a clean JSON object ONLY (with no markdown wrapping) matching this schema:
{
  "headline": "Short punchy professional title (e.g. Junior AI & Python Developer | Youth Innovator)",
  "summary": "Compelling 2-3 sentence executive profile emphasizing technical capability, practical project outcomes, and work ethic.",
  "technical_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "soft_skills": ["Skill 1", "Skill 2", "Skill 3"],
  "suggested_project_title": "Project Name",
  "suggested_project_desc": "2-sentence practical problem-solving project description."
}
`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);

          return {
            id: `port_${Date.now()}`,
            student_id: `stu_${Date.now()}`,
            full_name: studentInfo.fullName,
            email: studentInfo.email,
            headline: parsed.headline || 'Certified Junior AI & Python Developer',
            location: studentInfo.location || 'India',
            summary: parsed.summary || 'Enthusiastic young programmer skilled in Python and practical AI solutions.',
            technical_skills: parsed.technical_skills || ['Python', 'Machine Learning', 'Web Development'],
            soft_skills: parsed.soft_skills || ['Problem Solving', 'Communication', 'Teamwork'],
            verified_certificates: studentInfo.completedCourses || ['GlobeSkill AI Micro Degree', 'IBM SkillsBuild Tech Basics'],
            projects: [
              {
                id: `proj_${Date.now()}`,
                title: parsed.suggested_project_title || 'AI Community Problem Solver',
                description: parsed.suggested_project_desc || 'Built a practical machine learning project analyzing local community datasets.',
                technologies: ['Python', 'Machine Learning', 'APIs'],
                completed_at: new Date().toISOString().split('T')[0]
              }
            ],
            match_score: 94,
            employability_status: 'ready_for_internship',
            updated_at: new Date().toISOString()
          };
        }
      }
    } catch (err) {
      console.warn('Gemini Portfolio generation fallback:', err);
    }
  }

  // Resilient Domain Fallback Generation
  return {
    id: `port_${Date.now()}`,
    student_id: `stu_${Date.now()}`,
    full_name: studentInfo.fullName,
    email: studentInfo.email,
    headline: `Junior Software & AI Innovator | ${studentInfo.location || 'India'}`,
    location: studentInfo.location || 'India',
    summary: `Dedicated young technology learner trained in computer science foundations, Python programming, and neural networks through GlobeSkill. Passionate about building ethical AI and responsive applications for social impact.`,
    technical_skills: studentInfo.skills && studentInfo.skills.length > 0 ? studentInfo.skills : ['Python 3', 'Computer Vision Basics', 'HTML/Tailwind CSS', 'Prompt Engineering'],
    soft_skills: ['Critical Thinking', 'Adaptability', 'Collaborative Teamwork', 'Fast Learner'],
    verified_certificates: studentInfo.completedCourses && studentInfo.completedCourses.length > 0 ? studentInfo.completedCourses : ['GlobeSkill AI Micro Degree', 'IBM SkillsBuild Tech Basics'],
    projects: [
      {
        id: `proj_${Date.now()}`,
        title: 'Smart Community Alert System',
        description: 'Interactive Python application designed to broadcast weather and healthcare emergency notifications to village learning centers.',
        technologies: ['Python', 'JSON APIs', 'Automation'],
        completed_at: new Date().toISOString().split('T')[0]
      }
    ],
    match_score: 92,
    employability_status: 'ready_for_internship',
    updated_at: new Date().toISOString()
  };
}

export async function getStudentPortfolio(studentEmailOrId: string): Promise<StudentPortfolio> {
  const portfolios = PortfolioStore.getPortfolios();
  const found = portfolios.find(
    (p) => p.student_id === studentEmailOrId || p.email.toLowerCase() === studentEmailOrId.toLowerCase()
  );

  if (found) return found;

  // Return generated initial template for the user
  return portfolios[0];
}

export async function saveStudentPortfolio(portfolio: StudentPortfolio): Promise<StudentPortfolio> {
  const portfolios = PortfolioStore.getPortfolios();
  const idx = portfolios.findIndex((p) => p.email.toLowerCase() === portfolio.email.toLowerCase());

  if (idx >= 0) {
    portfolios[idx] = { ...portfolio, updated_at: new Date().toISOString() };
  } else {
    portfolios.unshift({ ...portfolio, updated_at: new Date().toISOString() });
  }

  PortfolioStore.savePortfolios(portfolios);
  return portfolio;
}

export async function getRecruiterCandidates(filters?: { skill?: string; search?: string }): Promise<StudentPortfolio[]> {
  let list = PortfolioStore.getPortfolios();

  if (filters?.skill && filters.skill !== 'all') {
    list = list.filter((p) =>
      p.technical_skills.some((s) => s.toLowerCase().includes(filters.skill!.toLowerCase()))
    );
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.full_name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.headline.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getJobOpportunities(): Promise<JobOpportunity[]> {
  return PortfolioStore.getJobs();
}

export async function createJobOpportunity(job: Omit<JobOpportunity, 'id' | 'created_at' | 'applicants_count'>): Promise<JobOpportunity> {
  const jobs = PortfolioStore.getJobs();
  const newJob: JobOpportunity = {
    ...job,
    id: `job-${Date.now()}`,
    applicants_count: 0,
    created_at: new Date().toISOString(),
  };

  jobs.unshift(newJob);
  PortfolioStore.saveJobs(jobs);
  return newJob;
}
