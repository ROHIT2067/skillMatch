import driver from "../db.js";

const FIND_LEARNERS = `
  MATCH (learner:Learner)
  RETURN learner {
    .id,
    .name
  } AS learner
  ORDER BY learner.name
`;

export async function getLearners() {
  const session = driver.session();

  try {
    const result = await session.run(FIND_LEARNERS);

    return result.records.map((record) => record.get("learner"));
  } finally {
    await session.close();
  }
}
