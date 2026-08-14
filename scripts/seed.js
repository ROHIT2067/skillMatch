import driver from "../backend/db.js";
import "dotenv/config";

const clusters = [
  { id: "dsa", name: "DSA" },
  { id: "sql", name: "SQL" },
  { id: "typescript", name: "TypeScript" },
  { id: "react", name: "React" },
];

const topics = [
  { id: "dsa-complexity", name: "Time and Space Complexity", description: "Analyze algorithm efficiency using Big O notation.", clusterId: "dsa" },
  { id: "dsa-arrays", name: "Arrays and Strings", description: "Traverse and manipulate indexed sequences.", clusterId: "dsa" },
  { id: "dsa-linked-lists", name: "Linked Lists", description: "Work with pointer-based linear data structures.", clusterId: "dsa" },
  { id: "dsa-stacks-queues", name: "Stacks and Queues", description: "Apply LIFO and FIFO data structures.", clusterId: "dsa" },
  { id: "dsa-recursion", name: "Recursion", description: "Solve problems using recursive decomposition.", clusterId: "dsa" },
  { id: "dsa-trees", name: "Trees", description: "Traverse and manipulate hierarchical data structures.", clusterId: "dsa" },
  { id: "dsa-graphs", name: "Graphs", description: "Represent and traverse connected data.", clusterId: "dsa" },
  { id: "dsa-dynamic-programming", name: "Dynamic Programming", description: "Optimize overlapping recursive subproblems.", clusterId: "dsa" },

  { id: "sql-relational-model", name: "Relational Model", description: "Understand tables, keys, and relationships.", clusterId: "sql" },
  { id: "sql-select-filter", name: "SELECT and Filtering", description: "Retrieve and filter rows from tables.", clusterId: "sql" },
  { id: "sql-joins", name: "Joins", description: "Combine related data across tables.", clusterId: "sql" },
  { id: "sql-aggregation", name: "Aggregation and GROUP BY", description: "Summarize data with aggregate functions and groups.", clusterId: "sql" },
  { id: "sql-subqueries-ctes", name: "Subqueries and CTEs", description: "Structure multi-stage SQL queries.", clusterId: "sql" },
  { id: "sql-window-functions", name: "Window Functions", description: "Calculate rankings and running metrics across row sets.", clusterId: "sql" },
  { id: "sql-indexes", name: "Indexes and Query Plans", description: "Understand indexes and interpret query execution plans.", clusterId: "sql" },

  { id: "ts-javascript-foundations", name: "JavaScript Foundations", description: "Use JavaScript values, functions, objects, and modules.", clusterId: "typescript" },
  { id: "ts-basic-types", name: "TypeScript Basic Types", description: "Annotate primitives, arrays, objects, and functions.", clusterId: "typescript" },
  { id: "ts-interfaces-aliases", name: "Interfaces and Type Aliases", description: "Model reusable object and union shapes.", clusterId: "typescript" },
  { id: "ts-generics", name: "Generics", description: "Create reusable type-safe abstractions.", clusterId: "typescript" },
  { id: "ts-narrowing", name: "Type Narrowing", description: "Refine union types with runtime checks.", clusterId: "typescript" },
  { id: "ts-utility-types", name: "Utility and Mapped Types", description: "Transform existing types into new type definitions.", clusterId: "typescript" },
  { id: "ts-async", name: "Typed Asynchronous Code", description: "Type promises and asynchronous workflows.", clusterId: "typescript" },

  { id: "react-components", name: "Components and JSX", description: "Build reusable UI components with JSX.", clusterId: "react" },
  { id: "react-props-state", name: "Props and State", description: "Pass data and manage local component state.", clusterId: "react" },
  { id: "react-events-forms", name: "Events and Forms", description: "Handle user input and controlled forms.", clusterId: "react" },
  { id: "react-effects", name: "Effects and Data Fetching", description: "Synchronize components with external systems.", clusterId: "react" },
  { id: "react-context", name: "Context", description: "Share state through a component tree.", clusterId: "react" },
  { id: "react-custom-hooks", name: "Custom Hooks", description: "Extract reusable stateful behavior.", clusterId: "react" },
  { id: "react-routing", name: "Client-side Routing", description: "Map URLs to views in a single-page application.", clusterId: "react" },
  { id: "react-performance", name: "React Performance", description: "Measure and reduce unnecessary rendering work.", clusterId: "react" },
];

const prerequisites = [
  { from: "dsa-complexity", to: "dsa-arrays" },
  { from: "dsa-arrays", to: "dsa-linked-lists" },
  { from: "dsa-arrays", to: "dsa-stacks-queues" },
  { from: "dsa-arrays", to: "dsa-recursion" },
  { from: "dsa-linked-lists", to: "dsa-trees" },
  { from: "dsa-stacks-queues", to: "dsa-trees" },
  { from: "dsa-recursion", to: "dsa-trees" },
  { from: "dsa-trees", to: "dsa-graphs" },
  { from: "dsa-recursion", to: "dsa-dynamic-programming" },
  { from: "dsa-complexity", to: "dsa-dynamic-programming" },

  { from: "sql-relational-model", to: "sql-select-filter" },
  { from: "sql-select-filter", to: "sql-joins" },
  { from: "sql-select-filter", to: "sql-aggregation" },
  { from: "sql-joins", to: "sql-subqueries-ctes" },
  { from: "sql-aggregation", to: "sql-subqueries-ctes" },
  { from: "sql-subqueries-ctes", to: "sql-window-functions" },
  { from: "sql-joins", to: "sql-indexes" },
  { from: "sql-aggregation", to: "sql-indexes" },

  { from: "ts-javascript-foundations", to: "ts-basic-types" },
  { from: "ts-basic-types", to: "ts-interfaces-aliases" },
  { from: "ts-interfaces-aliases", to: "ts-generics" },
  { from: "ts-interfaces-aliases", to: "ts-narrowing" },
  { from: "ts-generics", to: "ts-utility-types" },
  { from: "ts-narrowing", to: "ts-utility-types" },
  { from: "ts-basic-types", to: "ts-async" },

  { from: "ts-javascript-foundations", to: "react-components" },
  { from: "react-components", to: "react-props-state" },
  { from: "react-props-state", to: "react-events-forms" },
  { from: "react-props-state", to: "react-effects" },
  { from: "react-props-state", to: "react-context" },
  { from: "react-effects", to: "react-custom-hooks" },
  { from: "react-context", to: "react-custom-hooks" },
  { from: "react-components", to: "react-routing" },
  { from: "react-custom-hooks", to: "react-performance" },
];

const learners = [
  { id: "learner-ammu", name: "Ammu" },
  { id: "learner-rohit", name: "Rohit" },
  { id: "learner-menst", name: "Mensteen" },
  { id: "learner-ebi", name: "Ebi" },
];

const progress = [
  {
    learnerId: "learner-ammu",
    completed: ["dsa-complexity", "dsa-arrays", "dsa-linked-lists", "dsa-stacks-queues", "sql-relational-model", "sql-select-filter"],
    pending: ["dsa-recursion", "dsa-trees", "dsa-graphs", "dsa-dynamic-programming", "sql-joins", "sql-aggregation", "sql-subqueries-ctes"],
  },
  {
    learnerId: "learner-rohit",
    completed: ["ts-javascript-foundations", "ts-basic-types", "ts-interfaces-aliases", "react-components", "react-props-state"],
    pending: ["ts-generics", "ts-narrowing", "ts-utility-types", "ts-async", "react-events-forms", "react-effects", "react-context", "react-custom-hooks", "react-routing", "react-performance"],
  },
  {
    learnerId: "learner-menst",
    completed: ["sql-relational-model", "sql-select-filter", "sql-joins", "sql-aggregation", "sql-subqueries-ctes", "ts-javascript-foundations", "ts-basic-types"],
    pending: ["sql-window-functions", "sql-indexes", "ts-interfaces-aliases", "ts-generics", "ts-narrowing", "ts-async"],
  },
  {
    learnerId: "learner-ebi",
    completed: ["dsa-complexity", "dsa-arrays", "dsa-recursion", "ts-javascript-foundations", "react-components"],
    pending: ["dsa-linked-lists", "dsa-stacks-queues", "dsa-trees", "dsa-dynamic-programming", "react-props-state", "react-routing"],
  },
];

const sessions = [
  { id: "session-2025-01", date: "2025-01-13", notes: "DSA foundations and complexity analysis.", topicIds: ["dsa-complexity", "dsa-arrays"] },
  { id: "session-2025-02", date: "2025-01-20", notes: "Relational foundations and basic querying.", topicIds: ["sql-relational-model", "sql-select-filter"] },
  { id: "session-2025-03", date: "2025-01-27", notes: "TypeScript foundations and object modeling.", topicIds: ["ts-javascript-foundations", "ts-basic-types", "ts-interfaces-aliases"] },
  { id: "session-2025-04", date: "2025-02-03", notes: "React component fundamentals.", topicIds: ["react-components", "react-props-state"] },
  { id: "session-2025-05", date: "2025-02-10", notes: "Recursive structures and tree traversal.", topicIds: ["dsa-recursion", "dsa-trees"] },
  { id: "session-2025-06", date: "2025-02-17", notes: "Combining and summarizing relational data.", topicIds: ["sql-joins", "sql-aggregation"] },
];

const constraintQueries = [
  "CREATE CONSTRAINT topic_id_unique IF NOT EXISTS FOR (topic:Topic) REQUIRE topic.id IS UNIQUE",
  "CREATE CONSTRAINT cluster_id_unique IF NOT EXISTS FOR (cluster:TopicCluster) REQUIRE cluster.id IS UNIQUE",
  "CREATE CONSTRAINT learner_id_unique IF NOT EXISTS FOR (learner:Learner) REQUIRE learner.id IS UNIQUE",
  "CREATE CONSTRAINT session_id_unique IF NOT EXISTS FOR (session:Session) REQUIRE session.id IS UNIQUE",
];

function validateProgressData() {
  for (const learner of progress) {
    const completed = new Set(learner.completed);
    const overlap = learner.pending.filter((topicId) => completed.has(topicId));

    if (overlap.length > 0) {
      throw new Error(`Invalid seed progress for ${learner.learnerId}: ${overlap.join(", ")}`);
    }
  }
}

function toNumber(value) {
  return typeof value?.toNumber === "function" ? value.toNumber() : Number(value);
}

async function verifySeed(session) {
  const nodeResult = await session.run(`
    MATCH (node)
    WHERE node:Topic OR node:TopicCluster OR node:Learner OR node:Session
    UNWIND labels(node) AS label
    WITH label, count(*) AS count
    WHERE label IN $labels
    RETURN label, count
    ORDER BY label
  `, { labels: ["Topic", "TopicCluster", "Learner", "Session"] });

  const relationshipResult = await session.run(`
    MATCH ()-[relationship]->()
    WITH type(relationship) AS type, count(*) AS count
    WHERE type IN $types
    RETURN type, count
    ORDER BY type
  `, { types: ["PREREQUISITE_OF", "BELONGS_TO", "COMPLETED", "PENDING", "COVERED"] });

  const orphanResult = await session.run(`
    MATCH (topic:Topic)
    WHERE NOT (topic)--()
    RETURN count(topic) AS count
  `);

  const clusterIssueResult = await session.run(`
    MATCH (topic:Topic)
    OPTIONAL MATCH (topic)-[:BELONGS_TO]->(cluster:TopicCluster)
    WITH topic, count(cluster) AS clusterCount
    WHERE clusterCount <> 1
    RETURN count(topic) AS count
  `);

  const progressConflictResult = await session.run(`
    MATCH (learner:Learner)-[:COMPLETED]->(topic:Topic)
    MATCH (learner)-[:PENDING]->(topic)
    RETURN count(DISTINCT [learner.id, topic.id]) AS count
  `);

  return {
    nodes: Object.fromEntries(nodeResult.records.map((record) => [record.get("label"), toNumber(record.get("count"))])),
    relationships: Object.fromEntries(relationshipResult.records.map((record) => [record.get("type"), toNumber(record.get("count"))])),
    orphanTopics: toNumber(orphanResult.records[0].get("count")),
    invalidClusterMemberships: toNumber(clusterIssueResult.records[0].get("count")),
    progressConflicts: toNumber(progressConflictResult.records[0].get("count")),
  };
}

async function seed() {
  validateProgressData();

  const session = driver.session();

  try {
    await driver.verifyConnectivity();

    console.log("Creating uniqueness constraints...");
    for (const query of constraintQueries) {
      await session.run(query);
    }

    console.log("Seeding topic clusters...");
    await session.run(`
      UNWIND $clusters AS row
      MERGE (cluster:TopicCluster {id: row.id})
      SET cluster.name = row.name
    `, { clusters });

    console.log("Seeding topics and cluster memberships...");
    await session.run(`
      UNWIND $topics AS row
      MERGE (topic:Topic {id: row.id})
      SET topic.name = row.name,
          topic.description = row.description
      WITH topic, row
      MATCH (cluster:TopicCluster {id: row.clusterId})
      OPTIONAL MATCH (topic)-[oldMembership:BELONGS_TO]->(otherCluster:TopicCluster)
      WHERE otherCluster.id <> row.clusterId
      DELETE oldMembership
      MERGE (topic)-[:BELONGS_TO]->(cluster)
    `, { topics });

    console.log("Seeding prerequisite relationships...");
    await session.run(`
      UNWIND $prerequisites AS row
      MATCH (prerequisite:Topic {id: row.from})
      MATCH (topic:Topic {id: row.to})
      MERGE (prerequisite)-[:PREREQUISITE_OF]->(topic)
    `, { prerequisites });

    console.log("Seeding learners...");
    await session.run(`
      UNWIND $learners AS row
      MERGE (learner:Learner {id: row.id})
      SET learner.name = row.name
    `, { learners });

    console.log("Seeding completed relationships...");
    await session.run(`
      UNWIND $progress AS learnerProgress
      MATCH (learner:Learner {id: learnerProgress.learnerId})
      UNWIND learnerProgress.completed AS topicId
      MATCH (topic:Topic {id: topicId})
      MATCH (learner)-[pending:PENDING]->(topic)
      DELETE pending
    `, { progress });

    await session.run(`
      UNWIND $progress AS learnerProgress
      MATCH (learner:Learner {id: learnerProgress.learnerId})
      UNWIND learnerProgress.completed AS topicId
      MATCH (topic:Topic {id: topicId})
      MERGE (learner)-[:COMPLETED]->(topic)
    `, { progress });

    console.log("Seeding pending relationships...");
    await session.run(`
      UNWIND $progress AS learnerProgress
      MATCH (learner:Learner {id: learnerProgress.learnerId})
      UNWIND learnerProgress.pending AS topicId
      MATCH (topic:Topic {id: topicId})
      MATCH (learner)-[completed:COMPLETED]->(topic)
      DELETE completed
    `, { progress });

    await session.run(`
      UNWIND $progress AS learnerProgress
      MATCH (learner:Learner {id: learnerProgress.learnerId})
      UNWIND learnerProgress.pending AS topicId
      MATCH (topic:Topic {id: topicId})
      MERGE (learner)-[:PENDING]->(topic)
    `, { progress });

    console.log("Seeding sessions and covered relationships...");
    await session.run(`
      UNWIND $sessions AS row
      MERGE (trainingSession:Session {id: row.id})
      SET trainingSession.date = date(row.date),
          trainingSession.notes = row.notes
      WITH trainingSession, row
      UNWIND row.topicIds AS topicId
      MATCH (topic:Topic {id: topicId})
      MERGE (trainingSession)-[:COVERED]->(topic)
    `, { sessions });

    console.log("Verifying seeded graph...");
    const summary = await verifySeed(session);

    console.log("Seed completed successfully.");
    console.log("Node counts:", summary.nodes);
    console.log("Relationship counts:", summary.relationships);
    console.log("Integrity checks:", {
      orphanTopics: summary.orphanTopics,
      topicsWithInvalidClusterCount: summary.invalidClusterMemberships,
      completedPendingConflicts: summary.progressConflicts,
    });
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

await seed();
