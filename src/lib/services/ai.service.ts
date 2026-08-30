import { AiChatMessage } from '@/types/database';

const SYSTEM_PROMPT = `
You are 'Sparky', the GlobeSkill AI Coding Mentor for Kids and Young Learners.
Your mission is to make computer science, coding, and Artificial Intelligence exciting, friendly, and super simple to understand for children from underserved communities.

Key Guidelines:
1. Use warm, encouraging, kid-friendly analogies:
   - Variables = labelled toy boxes or storage bins where you keep your favourite toys.
   - Loops = a merry-go-round or repeating your morning brushing routine.
   - Functions = magic recipe cards where you put in ingredients and get a delicious treat.
   - If/Else = choosing between eating an ice cream or wearing a raincoat when it pours.
   - Neural Networks / AI = a brain made of lightbulbs that learn to recognize patterns after seeing lots of pictures.
2. Provide short, colorful, easy-to-read code snippets (Python or JavaScript).
3. Always ask an engaging follow-up question or suggest a fun mini-experiment.
4. Keep the tone inspiring, uplifting, and clear.
`;

export async function askAiMentor(userPrompt: string, _history: AiChatMessage[] = []): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey && !apiKey.includes('your-')) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nStudent asked: ${userPrompt}` }] }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch {
      // Fallback to local mentor engine
    }
  }

  // Resilient Domain AI Mentor Engine
  return generateKidsMentorResponse(userPrompt);
}

function generateKidsMentorResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('variable') || p.includes('store') || p.includes('what is a variable')) {
    return `🌟 **Think of a Variable like a Labelled Toy Box!**

Imagine you have a box with a sticker on it that says **\`player_score\`**. Right now, you drop the number \`10\` inside it!

Here is how you do it in Python:
\`\`\`python
player_score = 10
print("Your score is:", player_score)
\`\`\`

Whenever you score another goal, you can change what is inside the box:
\`\`\`python
player_score = player_score + 5  # Now it holds 15!
\`\`\`

💡 **Fun Challenge:** What would you store in a variable called \`superhero_power\`? Tell me your favorite superpower!`;
  }

  if (p.includes('loop') || p.includes('repeat') || p.includes('for') || p.includes('while')) {
    return `🎡 **Loops are like a Fun Merry-Go-Round!**

Instead of writing "Jump! Jump! Jump!" 100 times, a loop tells the computer to repeat an action automatically!

Here is a 5-star celebration loop in Python:
\`\`\`python
for count in range(1, 6):
    print(f"⭐ Star #{count}: Keep shining, young coder!")
\`\`\`

🔁 **Why is this cool?** You write just 2 lines of code, and the computer does the hard work thousands of times in a split second!

🚀 Would you like to build a loop that counts down a rocket launch? (10... 9... 8... 🚀)`;
  }

  if (p.includes('ai') || p.includes('artificial intelligence') || p.includes('machine learning') || p.includes('neural')) {
    return `🤖 **How Does Artificial Intelligence Actually Think?**

Just like you learned to recognize cats by looking at lots of cute cat pictures, an AI learns by finding **patterns**!

1. **Input:** You show the AI 1,000 photos of puppies and kittens. 🐶🐱
2. **Learning:** The computer looks for triangle ears, whiskers, and fluffy tails.
3. **Prediction:** When you show a brand new puppy, the AI proudly says: *"Aha! That is a puppy with 99% certainty!"*

✨ At GlobeSkill, you will learn to build your very own AI model to recognize hand gestures! Are you ready to teach a computer to see?`;
  }

  if (p.includes('function') || p.includes('def') || p.includes('method')) {
    return `📜 **A Function is like a Magic Recipe Card!**

Imagine having a recipe to make a chocolate milkshake. Whenever you're hungry, you just shout the recipe name instead of listing every single step!

Here is how we make a magic function in Python:
\`\`\`python
def make_milkshake(flavor):
    return f"🥤 Delicious {flavor} milkshake is ready for you!"

# Call your magic recipe anytime!
print(make_milkshake("Chocolate"))
print(make_milkshake("Mango"))
\`\`\`

🎉 What flavor milkshake would you code today?`;
  }

  if (p.includes('python') || p.includes('coding') || p.includes('start') || p.includes('hello')) {
    return `👋 **Hello young creator! I am Sparky, your AI Learning Buddy!**

Coding is like having real superpowers—you can create games, draw art with math, build robots, and solve real-world problems for your community!

Here is your very first line of code:
\`\`\`python
print("🌍 Hello GlobeSkill! I am ready to change the world!")
\`\`\`

What would you like to build today? A game, an AI chatbot, or your own website?`;
  }

  return `✨ **Great question! Let's explore this step by step!**

When we code, we break big problems into small, fun puzzle pieces. 

Here is a gold-standard tip:
1. Think about the **Input** (what you give the computer).
2. Think about the **Logic** (the rules or steps).
3. Think about the **Output** (what exciting result shows up on screen!).

\`\`\`python
# Simple rule: If you practice every day, you become a master coder!
days_practiced = 7
if days_practiced >= 5:
    print("🏆 You unlocked the Young Tech Leader Badge!")
\`\`\`

Would you like me to show you how to write code for this in Python or JavaScript? Just ask! 🚀`;
}
