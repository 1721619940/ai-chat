import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { Message } from "../models/Message.js";
import { generateAIReply } from "../services/ai-client.js";
import { chatRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// POST /chat/send
router.post("/send", authMiddleware, chatRateLimiter, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "message required" });

    // Save user message
    const userMsg = await Message.create({
      userId: req.user.id,
      role: "user",
      content: message,
    });

    // Get AI reply
    const aiText = await generateAIReply(message);

    const aiMsg = await Message.create({
      userId: req.user.id,
      role: "assistant",
      content: aiText,
    });

    res.json({
      reply: aiText,
      messages: [userMsg, aiMsg],
    });
  } catch (err) {
    console.error("Chat send error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /chat/history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.id })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ messages });
  } catch (err) {
    console.error("Chat history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
