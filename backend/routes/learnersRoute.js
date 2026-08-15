import { Router } from "express";
import { getLearners } from "../queries/learners.js";
import { getLearnerProgress } from "../queries/learnerProgress.js";
import { getNextRecommendedTopics } from "../queries/nextTopics.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const learners = await getLearners();
    res.json(learners);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/progress", async (req, res, next) => {
  try {
    const learnerId = req.params.id;
    const progress = await getLearnerProgress(learnerId);

    if (progress === null) {
      return res.status(404).json({
        error: "Learner not found",
      });
    }

    res.json(progress);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/recommendations", async (req, res, next) => {
  try {
    const learnerId = req.params.id;
    const recommendations = await getNextRecommendedTopics(learnerId);
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
});

export default router;
