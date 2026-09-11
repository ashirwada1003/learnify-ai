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

module.exports = {generateEmbedding};