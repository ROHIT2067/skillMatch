import { Router } from "express";
import { getTopics } from "../queries/topics.js";
import { getTopicById } from "../queries/topicById.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const topics = await getTopics();
    res.json(topics);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const topicId = req.params.id;
    const topic = await getTopicById(topicId);

    if (topic === null) {
      return res.status(404).json({
        error: "Topic not found",
      });
    }

    res.json(topic);
  } catch (error) {
    next(error);
  }
});

export default router;
