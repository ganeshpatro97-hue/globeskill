import { AiChatMessage } from '@/types/database';
import { LanguageCode, getLocalizedSystemPrompt } from '@/context/LanguageContext';

/**
 * GlobeSkill AI Coding Mentor Service (Sparky 🌟)
 * Provides kid-friendly, encouraging programming and AI education in clean, accessible English.
 */
export async function askAiMentor(userPrompt: string, _history: AiChatMessage[] = [], lang: LanguageCode = 'en'): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const systemPrompt = getLocalizedSystemPrompt(lang);

  if (apiKey && !apiKey.includes('your-') && !apiKey.includes('placeholder')) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent asked: ${userPrompt}` }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) return text.trim();
      }
    } catch {
      // Fallback to local mentor engine
    }
  }

  // Resilient Local Kids AI Coding Mentor Engine (English)
  return generateKidsMentorResponse(userPrompt);
}

function generateKidsMentorResponse(prompt: string): string {
  const p = prompt.toLowerCase().trim();

  // API
  if (p.includes('api') || p.includes('what is an api')) {
    return `🍽️ **Think of an API like a Friendly Waiter at a Restaurant!**

Imagine you are sitting at a table:
1. **You (Client/App):** You look at the menu and decide you want pizza! 🍕
2. **The Waiter (API):** Takes your order back into the kitchen.
3. **The Kitchen (Server/Database):** Prepares the delicious pizza.
4. **The Waiter (API):** Brings the steaming hot food right back to your table!

💡 **In real software:** When your weather app tells you it is raining outside, it used an **API** to ask the weather satellite for today's forecast and showed it to you!

\`\`\`python
# Simple Python code fetching data using an API:
import requests
response = requests.get("https://api.globeskill.org/daily-challenge")
print("Today's Quest:", response.json()["title"])
\`\`\`

Would you like to learn how to build your very own API today?`;
  }

  // Database
  if (p.includes('database') || p.includes('why use a database') || p.includes('db')) {
    return `📚 **A Database is like a Giant, Super-Organized Digital Library!**

Imagine playing your favorite video game and collecting 1,000 shiny gems. If you turn off your computer, where do those gems stay safe? **In the Database!**

✨ **Why do we need a Database?**
1. **Permanent Memory:** Your game scores, photos, and login details never get lost.
2. **Super Fast Search:** It can find 1 student out of 1,000,000 in less than a blink of an eye!
3. **Neat Tables:** It organizes everything into tidy rows and columns, just like a magic spreadsheet.

\`\`\`sql
-- Storing a new student in the database:
INSERT INTO students (name, xp_points, badge)
VALUES ('Aarav', 500, 'Master Coder 🏆');
\`\`\`

Would you like to design a database table for your dream game or school?`;
  }

  // Variable
  if (p.includes('variable') || p.includes('store') || p.includes('what is a variable')) {
    return `📦 **Think of a Variable like a Labelled Toy Box!**

Imagine you have a plastic storage box with a label that says **\`player_score\`**. Right now, you drop the number \`10\` inside it!

Here is how you write that in Python:
\`\`\`python
player_score = 10
print("Your score is:", player_score)

# When you score another goal:
player_score = player_score + 5  # Now it holds 15!
\`\`\`

💡 **Fun Challenge:** What would you store in a variable named \`my_superpower\`? Tell me your favorite superpower!`;
  }

  // Loops
  if (p.includes('loop') || p.includes('repeat') || p.includes('for') || p.includes('while')) {
    return `🎡 **Loops are like a Fun Merry-Go-Round!**

Instead of typing "Jump! Jump! Jump!" 100 times, a loop tells the computer to repeat an action automatically!

\`\`\`python
for count in range(1, 6):
    print(f"⭐ Star #{count}: Keep shining, young coder!")
\`\`\`

🔁 **Why is this awesome?** You write just 2 lines of code, and the computer runs it 1,000 times in a split second!

🚀 Would you like to build a loop that counts down a rocket launch? (10... 9... 8... 🚀)`;
  }

  // AI & Machine Learning
  if (p.includes('ai') || p.includes('artificial intelligence') || p.includes('machine learning') || p.includes('neural')) {
    return `🤖 **How Does Artificial Intelligence Actually Think?**

Just like you learned to recognize cats by looking at cute kitten pictures, an AI learns by spotting **patterns**!

1. **Input:** We show the AI 1,000 photos of puppies and kittens. 🐶🐱
2. **Learning:** The computer discovers triangle ears, whiskers, and fluffy tails.
3. **Prediction:** When you show a new picture, the AI says: *"That is a puppy with 99% certainty!"*

✨ At GlobeSkill, you will train your own AI model to recognize hand gestures! Are you ready?`;
  }

  // Function
  if (p.includes('function') || p.includes('def') || p.includes('method')) {
    return `📜 **A Function is like a Magic Recipe Card!**

Imagine having a recipe card for a chocolate milkshake. Whenever you are hungry, you just say the recipe name instead of repeating every ingredient step!

\`\`\`python
def make_milkshake(flavor):
    return f"🥤 Delicious {flavor} milkshake is ready!"

print(make_milkshake("Chocolate"))
print(make_milkshake("Mango"))
\`\`\`

🎉 What flavor milkshake would you code today?`;
  }

  // Default encouraging response
  return `✨ **Great question! Let's break this down into a fun puzzle!**

In coding, every big idea is made of small, simple steps:
1. **Input:** What information you give to the computer.
2. **Logic:** The rules or instructions you write.
3. **Output:** The exciting result that appears on your screen!

\`\`\`python
# Try this in our GlobeSkill Sandbox:
learner_name = "Future Tech Innovator"
print(f"🚀 Welcome to GlobeSkill, {learner_name}! Let's build something amazing!")
\`\`\`

Would you like to try writing code for this in Python or JavaScript? Ask me anything! 🌟`;
}
