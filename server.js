const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const port = 3000;
const apiKey = 'AIzaSyCs8Vg2Y2jkbLvFKD4MGlLjBtNYHqUNJPI'; // Replace with your actual API key

const genAI = new GoogleGenerativeAI(apiKey);

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    const userInput = req.body.prompt;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(userInput);
        const response = await result.response;
        const botReply = await response.text();

        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
