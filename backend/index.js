import express from "express";
import topicsRouter from "./routes/topicsRoute.js";
import learnersRouter from "./routes/learnersRoute.js";
import pathRouter from "./routes/pathRoute.js";
import gapsRouter from "./routes/gapsRoute.js";

const app = express();

app.use(express.json());


app.use("/learners", learnersRouter);
app.use("/path", pathRouter);
app.use("/gaps", gapsRouter);
app.use("/topics", topicsRouter);
app.use("/", topicsRouter);

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
