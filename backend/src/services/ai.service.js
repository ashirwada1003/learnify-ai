// This file handles talking to Gemini's AI model to convert text into embeddings
// (embeddings = a list of numbers representing the MEANING of the text)
const genAI = require('../config/gemini');

// This function takes any text (like a lesson's content) and returns
// its embedding — a list of numbers Gemini generates to represent that text's meaning
const generateEmbedding = async(text)=>{

    // Step 1: pick the specific Gemini model whose job is creating embeddings
    // (Gemini has different models for different jobs — this one is just for embeddings)
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    // Step 2: send our text to Gemini and wait for it to send back the embedding
    const result = await model.embedContent(text);

    // Step 3: the actual list of numbers is nested inside the response —
    // we pull it out and return just that part
    return result.embedding.values; //this is the actual array of numbers

};

 // This function compares two embeddings (lists of numbers) and returns
 // a single score showing how similar they are — closer to 1 = very similar,
 // closer to 0 = unrelated. Same idea as comparing "taste profiles" in matchmaking.

const cosineSimilarity = (vectorA, vectorB) => {
    // Step 1: multiply matching positions together, and add all those up
    let dotProduct = 0;
    for (let i = 0; i < vectorA.length; i++) {
        dotProduct += vectorA[i] * vectorB[i];
    }

    // Step 2: find the "length" (magnitude) of each vector
    let magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
    let magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));

    // Step 3: the actual cosine similarity formula
    return dotProduct / (magnitudeA * magnitudeB);
};

const generateAnswer = async(question,context)=>{
    const model = genAI.getGenerativeModel({model:"gemini-3.6-flash"});

    const prompt =`You are helpful tutor.Answer a student's question using ONLY the context below. If the context doesn't contain the answer, say you don't have enough information.

    Context:${context}

    Question:${question}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
};

// This function asks Gemini to generate multiple-choice quiz questions
// based on a lesson's content, and returns them as structured data (not plain text)

const generateQuiz = async (content, numQuestions = 5) => {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    // We explicitly show Gemini the EXACT JSON shape we want back —
    // this is how we get structured data instead of a plain sentence
    const prompt = `You are a quiz generator for an educational platform.
Based ONLY on the lesson content below, generate exactly ${numQuestions} multiple-choice questions.

Respond with ONLY valid JSON, in this EXACT format, and nothing else — no markdown, no explanation:
[
  {
    "questionText": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": "..."
  }
]

Lesson content: ${content}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Gemini sometimes wraps JSON in markdown code fences (```json ... ```) —
    // we strip those out before trying to parse, since ``` isn't valid JSON
    const cleanedText = rawText.replace(/```json|```/g, '').trim();

    // convert the JSON text into an actual JavaScript array we can save to the DB
    return JSON.parse(cleanedText);
};

module.exports = { generateEmbedding,cosineSimilarity,generateAnswer,generateQuiz};

