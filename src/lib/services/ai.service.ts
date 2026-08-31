import { AiChatMessage } from '@/types/database';
import { LanguageCode, getLocalizedSystemPrompt } from '@/context/LanguageContext';

export async function askAiMentor(userPrompt: string, _history: AiChatMessage[] = [], lang: LanguageCode = 'en'): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const systemPrompt = getLocalizedSystemPrompt(lang);

  if (apiKey && !apiKey.includes('your-')) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent asked (in ${lang}): ${userPrompt}` }] }
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

  // Resilient Domain AI Mentor Engine (Multilingual fallback)
  return generateKidsMentorResponse(userPrompt, lang);
}

function generateKidsMentorResponse(prompt: string, lang: LanguageCode = 'en'): string {
  const p = prompt.toLowerCase();

  // Hindi responses
  if (lang === 'hi') {
    if (p.includes('variable') || p.includes('वेरिएबल') || p.includes('store')) {
      return `🌟 **वेरिएबल (Variable) को खिलौनों के लेबल वाले डिब्बे की तरह समझें!**

मान लीजिए आपके पास एक डिब्बा है जिस पर **\`player_score\`** लिखा है। अभी आपने उसमें नंबर \`10\` रखा है!

पायथन (Python) में इसे ऐसे लिखते हैं:
\`\`\`python
player_score = 10
print("आपका स्कोर है:", player_score)
\`\`\`

💡 **मज़ेदार सवाल:** क्या आप \`my_superpower\` नाम के वेरिएबल में अपनी पसंदीदा सुपरपावर स्टोर करना चाहेंगे? मुझे बताएं!`;
    }

    if (p.includes('loop') || p.includes('लूप') || p.includes('repeat')) {
      return `🎡 **लूप्स (Loops) एक मज़ेदार झूले की तरह होते हैं!**

बार-बार एक ही काम लिखने के बजाय, लूप कंप्यूटर को स्वचालित रूप से वही काम दोहराने के लिए कहता है!

\`\`\`python
for count in range(1, 6):
    print(f"⭐ स्टार #{count}: चमकते रहो, युवा कोडर!")
\`\`\`

🚀 क्या आप 10 से 1 तक रॉकेट लॉन्च काउंटडाउन का लूप बनाना चाहते हैं?`;
    }
  }

  // Tamil responses
  if (lang === 'ta') {
    if (p.includes('variable') || p.includes('store')) {
      return `🌟 **Variable என்பது பெயர் ஒட்டப்பட்ட பொம்மை பெட்டி போன்றது!**

உங்களிடம் **\`player_score\`** என்ற லேபிளுடன் ஒரு பெட்டி உள்ளது என்று கற்பனை செய்து பாருங்கள். இப்போது அதில் \`10\` என்ற எண்ணை வைக்கிறீர்கள்!

\`\`\`python
player_score = 10
print("உங்கள் மதிப்பெண்:", player_score)
\`\`\`

💡 அடுத்த நிலைக்குச் செல்லும்போது, அந்தப் பெட்டியில் மதிப்பை எளிதாக மாற்றலாம்!`;
    }
  }

  // Default English responses
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
