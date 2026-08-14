import driver from "./db.js";

try {
  await driver.verifyConnectivity();
  console.log("Connected to CognoDB successfully!");
} catch (error) {
  console.error("Connection failed:", error);
} finally {
  await driver.close();
}
