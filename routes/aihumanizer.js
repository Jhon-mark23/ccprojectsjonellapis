const express = require('express');
const axios = require('axios');
const router = express.Router();

module.exports.routes = {
  name: "AI Humanizer Text",
  desc: "To Humanizes AI-generated text",
  category: "AI Tools",
  usages: "/api/aihuman",
  query: "?text=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }

  const postData = new URLSearchParams({
    aiText: text,
  });

  try {
    const response = await axios.post(
      'https://www.humanizeai.io/humanize_adv.php',
      postData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
