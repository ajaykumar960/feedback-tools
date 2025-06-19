import express from "express";
import Feedback from "../models/Feedback.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const feedbackRoutes = (io) => {
  // Public Route: Submit feedback
  router.post("/", async (req, res) => {
    try {
      const feedback = await Feedback.create(req.body);
      io.emit("new-feedback", feedback);
      res.status(201).json({ message: "Thank you!" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Protected Route: Get all feedbacks
  router.get("/all", verifyToken, async (req, res) => {
    try {
      const { sortBy = "createdAt", order = "desc" } = req.query;
      const sortOptions = { [sortBy]: order === "asc" ? 1 : -1 };
      const feedbacks = await Feedback.find().sort(sortOptions);
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Protected Route: Get stats
  router.get("/stats", verifyToken, async (req, res) => {
    try {
      const total = await Feedback.countDocuments();
      const avg = await Feedback.aggregate([
        { $group: { _id: null, average: { $avg: "$rating" } } },
      ]);
      res.json({ total, averageRating: avg[0]?.average || 0 });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};

export default feedbackRoutes;
