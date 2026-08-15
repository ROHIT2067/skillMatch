import driver from "../db.js";

const FIND_GAP_ANALYSIS = `
  MATCH (learner:Learner {id: $learnerId})
  MATCH (learner)-[:PENDING]->(topic:Topic)
  MATCH (topic)-[:BELONGS_TO]->(cluster:TopicCluster)

  WITH cluster, topic
  ORDER BY topic.name
  WITH cluster, collect(topic) AS topics

  RETURN
    cluster {
      .id,
      .name
    } AS cluster,
    [topic IN topics | {
      id: topic.id,
      name: topic.name,
      description: topic.description
    }] AS topics
  ORDER BY cluster.name
`;

export async function getGapAnalysis(learnerId) {
  const session = driver.session();

  try {
    const result = await session.run(FIND_GAP_ANALYSIS, {
      learnerId,
    });

    return result.records.map((record) => ({
      cluster: record.get("cluster"),
      topics: record.get("topics"),
    }));
  } finally {
    await session.close();
  }
}
