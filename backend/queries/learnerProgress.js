import driver from "../db.js";

const FIND_LEARNER_PROGRESS = `
  MATCH (learner:Learner {id: $learnerId})
  OPTIONAL MATCH (learner)-[:COMPLETED]->(completedTopic:Topic)
  WITH
    learner,
    [topic IN collect(DISTINCT completedTopic) | topic {
      .id,
      .name,
      .description
    }] AS completed

  OPTIONAL MATCH (learner)-[:PENDING]->(pendingTopic:Topic)
  RETURN
    learner {
      .id,
      .name
    } AS learner,
    completed,
    [topic IN collect(DISTINCT pendingTopic) | topic {
      .id,
      .name,
      .description
    }] AS pending
`;

export async function getLearnerProgress(learnerId) {
  const session = driver.session();

  try {
    const result = await session.run(FIND_LEARNER_PROGRESS, {
      learnerId,
    });

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    return {
      learner: record.get("learner"),
      completed: record.get("completed"),
      pending: record.get("pending"),
    };
  } finally {
    await session.close();
  }
}
