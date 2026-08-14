import "dotenv/config";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(
    process.env.COGNODB_USER,
    process.env.COGNODB_PASSWORD
  )
);

try {
  await driver.verifyConnectivity();
  console.log("Connected to CognoDB successfully!");
} catch (error) {
  console.error("Connection failed:", error);
} finally {
  await driver.close();
}