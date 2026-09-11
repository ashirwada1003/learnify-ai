// TEMPORARY test file — just to see what Gemini actually sends back.
// We'll delete this once we've confirmed embeddings work.

require('dotenv').config(); // loads your .env file so GEMINI_API_KEY is available

const { generateEmbedding } = require('./src/services/ai.service');

// an "IIFE" (a function that runs itself immediately) — lets us use await
// outside of an Express route, just for this quick test
(async () => {
    const text = "JSX is a syntax extension for JavaScript that looks similar to HTML.";

    console.log("Sending text to Gemini...");
    const embedding = await generateEmbedding(text);

    console.log("Got back an embedding with this many numbers:", embedding.length);
    console.log("First 5 numbers:", embedding.slice(0, 5));
})();