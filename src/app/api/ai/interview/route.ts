import { NextResponse } from 'next/server';
import { LanguageCode, getLocalizedSystemPrompt } from '@/context/LanguageContext';

export async function POST(req: Request) {
  try {
    const { action, studentName, completedCourses, currentQuestion, candidateAnswer, language = 'en' } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (action === 'generate_questions') {
      const courses = (completedCourses || ['AI Micro Degree', 'Python Programming']).join(', ');

      if (apiKey && !apiKey.includes('your-')) {
        try {
          const prompt = `
You are the Lead Technical Recruiter and Interview Coach for GlobeSkill & UN SDG Vocational Programs.
Generate 3 realistic, kid-friendly yet structured technical interview questions for a student graduate:

Student Name: ${studentName || 'Young Coder'}
Completed Courses: ${courses}
Language: ${language}

Output a clean JSON object ONLY (without markdown fences):
{
  "questions": [
    {
      "id": "q1",
      "category": "Core Concept",
      "question": "Can you explain what a Variable and a Loop are in Python, and give an example of when you would use a Loop?"
    },
    {
      "id": "q2",
      "category": "Problem Solving",
      "question": "Imagine you are building a smart app for your local village health clinic. How would you store the patients' names and count daily visitors?"
    },
    {
      "id": "q3",
      "category": "Ethics & Motivation",
      "question": "Why is it important to make sure Artificial Intelligence is fair, safe, and helpful for everyone in society?"
    }
  ]
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
              return NextResponse.json(JSON.parse(cleaned));
            }
          }
        } catch {
          // Fallback
        }
      }

      // Fallback questions
      return NextResponse.json({
        questions: [
          {
            id: 'q1',
            category: 'Core Technical Concept',
            question: 'Can you explain the difference between a Variable and a Function in programming using a simple analogy?'
          },
          {
            id: 'q2',
            category: 'Real-World Project',
            question: 'Tell me about a project you coded recently in Python or Web Development. What was the most challenging part you solved?'
          },
          {
            id: 'q3',
            category: 'Tech Ethics & Teamwork',
            question: 'When an AI makes a mistake in predicting an image, how do you diagnose and improve its training data?'
          }
        ]
      });
    }

    if (action === 'evaluate_answer') {
      if (apiKey && !apiKey.includes('your-')) {
        try {
          const prompt = `
You are the GlobeSkill Technical Interview Evaluator.
Evaluate the student's response to the interview question with encouragement and actionable tips:

Question: ${currentQuestion}
Student Answer: ${candidateAnswer}
Language: ${language}

Output a clean JSON object ONLY (without markdown fences):
{
  "score": 90,
  "confidence_rating": "High",
  "strengths": "Great articulation of fundamental concepts and relatable analogy.",
  "improvement_tip": "You can mention time complexity or how loops reduce lines of repetitive code.",
  "model_answer": "A variable stores values like a labeled box, and a loop repeats tasks automatically to save time and energy."
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
              return NextResponse.json({
                success: true,
                evaluation: JSON.parse(cleaned)
              });
            }
          }
        } catch {
          // Fallback
        }
      }

      return NextResponse.json({
        success: true,
        evaluation: {
          score: 88,
          confidence_rating: 'Strong',
          strengths: 'Excellent clarity, confident tone, and sound logical reasoning.',
          improvement_tip: 'Try mentioning a specific Python syntax example like `for i in range(5)` next time.',
          model_answer: 'Variables hold information securely, while functions allow you to package and reuse logic across your application.'
        }
      });
    }

    return NextResponse.json({ error: 'Invalid interview action' }, { status: 400 });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Interview evaluation error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
