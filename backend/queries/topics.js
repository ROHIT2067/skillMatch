import driver from "../db.js";

const FIND_TOPICS = `
  MATCH (topic:Topic)-[:BELONGS_TO]->(cluster:TopicCluster)
  RETURN
    topic {
      .id,
      .name,
      .description
    } AS topic,
    cluster {
      .id,
      .name
    } AS cluster
  ORDER BY cluster.name, topic.name
`;

export async function getTopics() {
  const session = driver.session();

  try {
    const result = await session.run(FIND_TOPICS);

    return result.records.map((record) => {
      const topic = record.get("topic");

      return {
        id: topic.id,
        name: topic.name,
        description: topic.description,
        cluster: record.get("cluster"),
      };
    });
  } finally {
    await session.close();
  }
}
