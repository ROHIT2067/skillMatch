//Receive fromId and toId, run the cypher query, return the rslt

import driver from "../db.js";

const FIND_PREREQUISITE_PATH = `
  MATCH (source:Topic {id: $fromId}),
        (target:Topic {id: $toId})
  MATCH p = shortestPath(
    (source)-[:PREREQUISITE_OF*2..]->(target)
  )
  RETURN
    [node IN nodes(p) | {
      id: node.id,
      name: node.name
    }] AS path,
    length(p) AS hops
`;

export async function findPrerequisitePath(fromId, toId) {
  const session = driver.session();

  try {
    const result = await session.run(FIND_PREREQUISITE_PATH, {
      fromId,
      toId,
    });

    return result.records.map((record) => ({
      path: record.get("path"),
      hops: record.get("hops"),
    }));
  } finally {
    await session.close();
  }
}