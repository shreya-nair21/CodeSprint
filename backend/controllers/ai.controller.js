import axios from 'axios';
import { Problem } from '../models.js';

// Controller to get a Socratic hint or engage in Socratic chatbot dialogue
export const getSocraticHint = async (req, res) => {
  try {
    const { problemId, code, language, chatHistory } = req.body;

    if (!problemId) {
      return res.status(400).json({ message: 'Problem ID is required' });
    }

    // Fetch problem details for AI context
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if Gemini API Key is missing
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Using local Socratic fallback.');
      
      const lastUserMessage = chatHistory && chatHistory.length > 0 
        ? chatHistory[chatHistory.length - 1].text.toLowerCase() 
        : '';
      
      let reply = '';
      if (lastUserMessage.includes('bug') || lastUserMessage.includes('error') || lastUserMessage.includes('fail')) {
        reply = `I see you are looking for bugs. Here are a few Socratic questions to guide you:
1. **Edge Cases**: Have you tested with empty inputs, extremely large values, or negative numbers?
2. **Off-by-One**: Are your loop indices strictly within the boundaries of the data structures?
3. **Dry Run**: Try taking a simple input like \`[2, 7, 11, 15]\` and stepping through your logic line-by-line. Where does the actual variable state deviate from your expectations?

*(💡 **Developer Note**: Configure a \`GEMINI_API_KEY\` in your backend \`.env\` file to unlock fully personalized real-time AI tutor conversations!)*`;
      } else if (lastUserMessage.includes('hint') || lastUserMessage.includes('help') || lastUserMessage.includes('stuck')) {
        reply = `Let's break this down together! 
- What is the most straightforward "brute force" way to solve this problem?
- Once we have the brute force solution, what is its bottle-neck? 
- Is there a way to store previously computed information (like in a Hash Map or array) to avoid repeating work?

Give that a thought and let me know which approach you want to explore first!

*(💡 **Developer Note**: Configure a \`GEMINI_API_KEY\` in your backend \`.env\` file to unlock fully personalized real-time AI tutor conversations!)*`;
      } else {
        reply = `Hello! I am your Socratic Mentor for **"${problem.title}"**. 

My goal is to help you think like a software engineer and solve this problem yourself! 

To get started, try asking me for a concept explanation, a gentle hint, or tell me what part of the problem description is confusing you. Let's conquer this challenge together!

*(💡 **Developer Note**: Configure a \`GEMINI_API_KEY\` in your backend \`.env\` file to unlock fully personalized real-time AI tutor conversations!)*`;
      }

      return res.json({ reply });
    }

    // Prepare Socratic system instructions
    const systemInstructionText = `You are Socrates AI, a world-class software engineering interviewer and Socratic coding mentor on the CodeSprint platform.
Your goal is to guide the user to solve their programming problem using SOCRATIC QUESTIONING.

CRITICAL RULES:
1. NEVER write full code solutions for the user. Do NOT write complete code blocks.
2. If the user explicitly asks for code, solutions, or copy-paste code, politely refuse and guide them to write it themselves by breaking the problem down.
3. You can point out logical errors, off-by-one errors, or bad time complexities in their current code.
4. If they have logical bugs, ask guiding questions that prompt them to trace their code with a specific test case where it would fail.
5. Keep your responses short, professional, highly encouraging, and beautifully structured in Markdown.

Here is the problem they are solving:
Title: "${problem.title}"
Difficulty: "${problem.difficulty}"
Description:
${problem.description}

Here is their current code written in "${language}":
\`\`\`${language}
${code || '// No code written yet'}
\`\`\`
`;

    // Map history to Gemini's format: { role: 'user' | 'model', parts: [{ text: string }] }
    // Note: Gemini API requires alternate user/model roles starting with user.
    const contents = [];
    
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach((msg) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Ensure the conversation starts with a user message, or at least has the current user prompt at the end
    // If contents is empty, we initialize it
    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Hello, I need some guidance on this problem.' }]
      });
    }

    // Call Google Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents,
        systemInstruction: {
          parts: [{ text: systemInstructionText }]
        }
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I am reflecting on your code. Could you explain the main idea of your current approach?";

    return res.json({ reply });

  } catch (error) {
    console.error('Error in getSocraticHint:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to generate Socratic response', 
      error: error.response?.data?.error?.message || error.message 
    });
  }
};

// Controller to analyze code complexity and structure
export const analyzeCodeComplexity = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId) {
      return res.status(400).json({ message: 'Problem ID is required' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Using local complexity fallback.');
      
      // Smart offline parser using keywords
      const codeStr = code || '';
      let time = 'O(N)';
      let space = 'O(1)';
      let bottlenecks = 'None identified offline.';
      let suggestions = 'Keep writing modular code!';

      if (codeStr.includes('for') || codeStr.includes('while')) {
        const matches = (codeStr.match(/for|while/g) || []).length;
        if (matches > 1) {
          time = 'O(N²) or O(N log N)';
          bottlenecks = 'Multiple loops detected. If these are nested, it could cause O(N²) quadratic time complexity.';
          suggestions = 'Consider if a Hash Map or Two-Pointer approach can optimize this to O(N) linear time.';
        } else {
          time = 'O(N)';
          bottlenecks = 'A single scan is efficient, but ensure operations inside the loop are O(1).';
          suggestions = 'Ensure your auxiliary space remains O(1) if possible.';
        }
      }

      if (codeStr.includes('Map') || codeStr.includes('Set') || codeStr.includes('dict') || codeStr.includes('list') || codeStr.includes('[]')) {
        space = 'O(N)';
        bottlenecks = 'Using additional collections increases memory utilization proportionally with input size.';
      }

      return res.json({
        timeComplexity: time,
        spaceComplexity: space,
        reviewPoints: [
          'Code structure looks solid.',
          bottlenecks
        ],
        suggestions: suggestions + '\n\n*(💡 Developer Note: Set GEMINI_API_KEY in .env for custom AI reviews)*'
      });
    }

    const promptText = `Analyze the following user code for the programming problem "${problem.title}".
Problem Description:
${problem.description}

User Code (${language}):
\`\`\`${language}
${code || '// No code written yet'}
\`\`\`

Provide a strict JSON response with the following keys. Do NOT include markdown formatting wrappers (like \`\`\`json) in the response text if possible, just return a clean string that can be parsed as JSON.
{
  "timeComplexity": "e.g., O(N) or O(N log N) or O(2^N)",
  "spaceComplexity": "e.g., O(1) or O(N)",
  "reviewPoints": [
    "A list of 2-3 specific feedback points concerning edge cases, modularity, or efficiency."
  ],
  "suggestions": "A short, positive suggestion for optimization or clean-up."
}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{
          role: 'user',
          parts: [{ text: promptText }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    let textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up any markdown code block wrappers if Gemini outputs them
    if (textResponse.includes('```')) {
      textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    try {
      const resultJson = JSON.parse(textResponse);
      return res.json(resultJson);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output. Raw output:', textResponse);
      // Fallback response with raw output loaded in suggestions
      return res.json({
        timeComplexity: 'Analyze Code',
        spaceComplexity: 'Analyze Code',
        reviewPoints: ['Unable to parse structured AI feedback.'],
        suggestions: textResponse || 'Try submitting your code again.'
      });
    }

  } catch (error) {
    console.error('Error in analyzeCodeComplexity:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to analyze code complexity', 
      error: error.response?.data?.error?.message || error.message 
    });
  }
};
