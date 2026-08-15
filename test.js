import driver from "./backend/db.js";
import { getLearnerProgress } from "./backend/queries/learnerProgress.js";

try {
  const result = await getLearnerProgress("learner-rohit");

  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("Test failed:", error);
} finally {
  await driver.close();
}