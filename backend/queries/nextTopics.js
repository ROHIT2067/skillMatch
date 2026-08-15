import driver from "../db.js";

const FIND_NEXT_RECOMMENDED_TOPICS = `
  MATCH (learner:Learner {id: $learnerId})
  OPTIONAL MATCH (learner)-[:COMPLETED]->(completedTopic:Topic)
  WITH learner, collect(DISTINCT completedTopic) AS completedTopics

  MATCH (topic:Topic)-[:BELONGS_TO]->(cluster:TopicCluster)
  WHERE NOT (topic IN completedTopics)

  OPTIONAL MATCH (prerequisite:Topic)-[:PREREQUISITE_OF*1..]->(topic)
  WITH
    topic,
    cluster,
    completedTopics,
    collect(DISTINCT prerequisite) AS prerequisites
  WHERE all(
    prerequisite IN prerequisites
    WHERE prerequisite IN completedTopics
  )

  RETURN
    topic {
      .id,
      .name,
      .description
    } AS topic,
    cluster {
      .id,
      .name
    } AS cluster,
    [prerequisite IN prerequisites | prerequisite {
      .id,
      .name
    }] AS prerequisites
  ORDER BY cluster.name, topic.name
`;

export async function getNextRecommendedTopics(learnerId) {
  const session = driver.session();

  try {
    const result = await session.run(FIND_NEXT_RECOMMENDED_TOPICS, {
      learnerId,
    });

    return result.records.map((record) => {
      const topic = record.get("topic");

      return {
        id: topic.id,
        name: topic.name,
        description: topic.description,
        cluster: record.get("cluster"),
        prerequisites: record.get("prerequisites"),
      };
    });
  } finally {
    await session.close();
  }
}
