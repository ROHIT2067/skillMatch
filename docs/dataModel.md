<---NODES--->
Topic
    id
    name
    description

TopicCluster
    id
    name

Learner
    id
    name


<---RELATIONSHIPS--->
(Topic)-[:PREREQUISITE_OF]->(Topic)
(Topic)-[:BELONGS_TO]->(TopicCluster)
(Learner)-[:COMPLETED]->(Topic)
(Learner)-[:PENDING]->(Topic)

<------------------------------------>

Data integrity rules

1. Topic.id, TopicCluster.id, and Learner.id are unique.
2. Every Topic belongs to exactly one TopicCluster.
3. PREREQUISITE_OF is directional.
4. A prerequisite path follows PREREQUISITE_OF in the forward direction.
5. PENDING represents an explicitly assigned topic.
6. A learner cannot have both COMPLETED and PENDING for the same Topic.
7. Circular PREREQUISITE_OF relationships are invalid curriculum data.

<------------------------------------>

## Constraints (run once against CognoDB before seeding)
CREATE CONSTRAINT topic_id_unique IF NOT EXISTS FOR (t:Topic) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT cluster_id_unique IF NOT EXISTS FOR (c:TopicCluster) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT learner_id_unique IF NOT EXISTS FOR (l:Learner) REQUIRE l.id IS UNIQUE;

<------------------------------------>

## Data provenance
Prerequisite structure and topic bottleneck patterns are based on real training-coordination
experience across DSA/SQL/TS/React cohorts. Specific Learner identities and their individual
COMPLETED/PENDING assignments are synthesized to reflect realistic patterns, not drawn from
actual student records.
