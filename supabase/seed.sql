-- ============================================================================
-- GLOBESKILL DATABASE SEED DATA
-- Mock technical courses, announcements, and demo records
-- ============================================================================

-- Insert sample trainer and admin profiles
INSERT INTO public.profiles (id, email, full_name, user_role, location, education_background, skill_interests)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@globeskill.org', 'Aarav Sharma (Admin)', 'admin', 'New Delhi, India', 'M.Tech Computer Science', ARRAY['AI Systems', 'Curriculum Design']),
  ('00000000-0000-0000-0000-000000000002', 'trainer.priya@globeskill.org', 'Priya Patel (Lead Instructor)', 'trainer', 'Bengaluru, India', 'Senior AI Engineer & Educator', ARRAY['Python', 'Machine Learning', 'Computer Vision']),
  ('00000000-0000-0000-0000-000000000003', 'student.rohit@globeskill.org', 'Rohit Kumar (Student)', 'student', 'Patna, Bihar', 'High School Student (Class 10)', ARRAY['Python Basics', 'Web Dev', 'Robotics'])
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Technical Courses
INSERT INTO public.courses (id, title, slug, tagline, description, duration, skill_level, category, image_url, syllabus, trainer_id, status, enrolled_count)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'AI Micro Degree for Young Innovators',
    'ai-micro-degree',
    'Master practical AI, Python programming, and build real-world machine learning models.',
    'A transformative 8-week program tailored for young students to demystify artificial intelligence. Learn how computers recognize images, understand human language, and generate creative art using neural networks.',
    '8 Weeks (48 Hours)',
    'Beginner',
    'AI & Machine Learning',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    '[
      {"id": "ch-101", "title": "1. What is Artificial Intelligence? (Demystifying AI for Kids)", "duration_minutes": 60, "description": "Understand how AI differs from ordinary code, with fun interactive examples."},
      {"id": "ch-102", "title": "2. Python Basics: Variables, Loops & Decision Making", "duration_minutes": 90, "description": "Hands-on coding in Python creating smart number guessers and mini text games."},
      {"id": "ch-103", "title": "3. Teaching Computers to See: Intro to Computer Vision", "duration_minutes": 120, "description": "Train a model to classify hand gestures, doodles, and webcam objects."},
      {"id": "ch-104", "title": "4. Natural Language Processing & Chatbots", "duration_minutes": 120, "description": "Build your first friendly text assistant using simple transformer concepts."},
      {"id": "ch-105", "title": "5. Ethics & Responsible AI: Safe Tech for Society", "duration_minutes": 90, "description": "Discuss fairness, privacy, and how AI can solve climate and healthcare challenges."},
      {"id": "ch-106", "title": "6. Capstone Project: Build & Deploy Your AI App", "duration_minutes": 180, "description": "Final showcase project presented to global NGO mentors and industry evaluators."}
    ]'::jsonb,
    '00000000-0000-0000-0000-000000000002',
    'published',
    142
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'IBM SkillsBuild Tech Basics',
    'ibm-skillsbuild-basics',
    'Foundations of Cloud Computing, Cybersecurity, and Professional Digital Literacy.',
    'Delivered in partnership with global tech standards, this course covers fundamental computing architecture, safe digital hygiene, cloud storage models, and collaborative workplace software skills.',
    '4 Weeks (24 Hours)',
    'Beginner',
    'Digital Literacy',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    '[
      {"id": "ch-201", "title": "1. Digital Citizenship & Cyber Safety Fundamentals", "duration_minutes": 45, "description": "Protecting personal identity and recognizing online vulnerabilities."},
      {"id": "ch-202", "title": "2. Understanding Cloud Infrastructure & Internet Protocols", "duration_minutes": 60, "description": "How the modern web works, servers, DNS, and remote computing."},
      {"id": "ch-203", "title": "3. Data Fundamentals & Spreadsheets for Analytics", "duration_minutes": 75, "description": "Working with data, basic formulas, and visualization charts."},
      {"id": "ch-204", "title": "4. Industry Micro-Credential Assessment", "duration_minutes": 60, "description": "Complete the official knowledge quiz to earn your recognized digital certificate."}
    ]'::jsonb,
    '00000000-0000-0000-0000-000000000002',
    'published',
    215
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'AI & Data Careers for Women',
    'ai-careers-for-women',
    'Empowering female students and youth with high-impact data science and career mentorship.',
    'An intensive accelerator designed to close the gender gap in tech. Features dedicated female industry mentors, real-world case studies, data visualization workshops, and portfolio building.',
    '6 Weeks (36 Hours)',
    'Intermediate',
    'Career & Mentorship',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    '[
      {"id": "ch-301", "title": "1. Introduction to Data Science with Pandas & Matplotlib", "duration_minutes": 90, "description": "Cleaning, filtering, and plotting real datasets."},
      {"id": "ch-302", "title": "2. Exploratory Data Analysis & Statistical Intuition", "duration_minutes": 90, "description": "Uncovering insights from social and community impact datasets."},
      {"id": "ch-303", "title": "3. Machine Learning Algorithms (Regression & Classification)", "duration_minutes": 120, "description": "Building predictive models using Scikit-Learn."},
      {"id": "ch-304", "title": "4. Portfolio Storytelling & Mentorship Roundtables", "duration_minutes": 90, "description": "Resume reviews, mock interviews, and direct mentor matching."}
    ]'::jsonb,
    '00000000-0000-0000-0000-000000000002',
    'published',
    98
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Full-Stack Web Development & Creative Coding',
    'web-dev-creative-coding',
    'Build websites, interactive apps, and creative games with HTML, CSS, JavaScript & React.',
    'From zero coding experience to deploying your own live applications on the web. Learn responsive design, modern JavaScript frameworks, and how to publish projects to the world.',
    '6 Weeks (40 Hours)',
    'Beginner',
    'Web & Cloud Development',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    '[
      {"id": "ch-401", "title": "1. HTML5 Structure & Semantic Layouts", "duration_minutes": 60, "description": "Creating clean web pages with accessible tags."},
      {"id": "ch-402", "title": "2. Modern CSS & Responsive Flexbox / Grid", "duration_minutes": 90, "description": "Styling mobile-friendly web pages that look stunning."},
      {"id": "ch-403", "title": "3. JavaScript Magic: Interactivity & Logic", "duration_minutes": 120, "description": "Building interactive quizzes, calculator, and sound boards."},
      {"id": "ch-404", "title": "4. Intro to React & Next.js Components", "duration_minutes": 120, "description": "State management, component reusability, and deploying online."}
    ]'::jsonb,
    '00000000-0000-0000-0000-000000000002',
    'published',
    188
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Seed Announcements
INSERT INTO public.announcements (id, title, content, author_id, target_role)
VALUES
  ('20000000-0000-0000-0000-000000000001', '🎉 New Batch for AI Micro Degree starting this Saturday!', 'Welcome all new students! Orientation starts live at 10:00 AM IST with live coding exercises and mentor breakouts.', '00000000-0000-0000-0000-000000000001', 'all'),
  ('20000000-0000-0000-0000-000000000002', '📢 Trainer Workshop: Upgraded AI Curriculum Tools', 'Trainers can now upload custom Jupyter notebooks and downloadable PDFs directly from their course studio dashboard.', '00000000-0000-0000-0000-000000000002', 'trainer')
ON CONFLICT (id) DO NOTHING;
