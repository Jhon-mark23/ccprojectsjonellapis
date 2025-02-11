const express = require('express');
const fs = require('fs').promises;
const { llama } = require("gpti");

const router = express.Router();

module.exports.routes = {
    name: "Llama 3.1 Conversation",
    desc: "Handles Llama 3.1 Conversations",
    usages: "/api/llama31",
    query: "?q=hi&id=1",
    method: "get",
    category: "AI Tools",
};

module.exports.onAPI = async (req, res) => {
    const q = req.query.q;
    const id = req.query.id;

    if (!q || !id) {
        return res.status(400).json({ error: 'Both "q" and "id" parameters are required' });
    }

    let messages = [];
    const filePath = `./json/llama/${id}.json`;

    try {
        const data = await fs.readFile(filePath, 'utf8');
        messages = JSON.parse(data);
    } catch (error) {
        messages = [
            { role: "system", content: "You're a helpful assistant." }
        ];
    }

    messages.push({ role: "user", content: q });

    try {
        const response = await llama({
            messages,
            markdown: false,
            stream: false
        });
        const message = messages

        res.json({ response, message });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
