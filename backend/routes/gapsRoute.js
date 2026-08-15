import { Router } from "express";
import { getGapAnalysis } from "../queries/gapAnalysis.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const learnerId = req.query.learnerId;

    if (!learnerId) {
      return res.status(400).json({
        error: "learnerId query parameter is required",
      });
    }

    const gaps = await getGapAnalysis(learnerId);
    res.json(gaps);
  } catch (error) {
    next(error);
  }
});

export default router;
