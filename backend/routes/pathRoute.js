import { Router } from "express";
import { findPrerequisitePath } from "../queries/prerequisitePath.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const fromId = req.query.from;
    const toId = req.query.to;

    if (!fromId || !toId) {
      return res.status(400).json({
        error: "Both from and to query parameters are required",
      });
    }

    const path = await findPrerequisitePath(fromId, toId);
    res.json(path);
  } catch (error) {
    next(error);
  }
});

export default router;
