import driver from "../db.js";

const FIND_TOPIC_BY_ID = `
  MATCH (topic:Topic {id: $topicId})-[:BELONGS_TO]->(cluster:TopicCluster)
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
`;

export async function getTopicById(topicId) {
  const session = driver.session();

  try {
    const result = await session.run(FIND_TOPIC_BY_ID, {
      topicId,
    });

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    const topic = record.get("topic");

    return {
      id: topic.id,
      name: topic.name,
      description: topic.description,
      cluster: record.get("cluster"),
    };
  } finally {
    await session.close();
  }
}
