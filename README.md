# Skill Path Navigator

## Overview

Skill Path Navigator is a full-stack application for inspecting technical-training progress against a prerequisite-based curriculum. It represents learners, topics, curriculum clusters, and learning dependencies in CognoDB, then exposes that graph through an Express API and a React interface.

The application answers questions that depend on relationships rather than isolated records: which topics a learner has completed or still has pending, which topic they are ready to study next, and which directed prerequisite path connects two topics.

## Key Features

- **Learner progress:** View a learner's completed and explicitly pending topics.
- **Next-topic recommendations:** Find incomplete topics for which the learner has completed every prerequisite, including transitive prerequisites.
- **Prerequisite path finder:** Find a directed shortest path between two curriculum topics.
- **Cohort gap analysis:** Group a selected learner's explicitly pending assignments by topic cluster.
- **Topic browsing:** List curriculum topics with their descriptions and clusters, or retrieve one topic by ID.
- **Learner browsing:** List the learners available in the cohort.

## Why a Graph Database?

The curriculum is a directed dependency graph. A relationship such as:

```text
(:Topic)-[:PREREQUISITE_OF]->(:Topic)
```

directly expresses that the topic on the left must be learned before the topic on the right. The direction is meaningful: a path from Arrays to Graphs is not equivalent to a path from Graphs to Arrays.

Graph traversal also makes multi-hop questions explicit. The path finder follows one or more `PREREQUISITE_OF` relationships, while recommendation logic traverses all upstream prerequisites of a candidate topic. These operations work on connected paths without manually joining a fixed number of prerequisite levels.

## Architecture

The repository deliberately uses a small architecture with no controller or backend service layer. Express route modules handle HTTP concerns and delegate database work to query modules. All query modules use the shared Neo4j-compatible driver exported by `backend/db.js`.

```text
Browser
  |
  v
React + Vite frontend
  |-- React Router pages
  `-- src/services/api.js
          |
          | HTTP / JSON
          v
Node.js + Express API
  |-- Route modules
  `-- Query modules (parameterized openCypher)
          |
          v
Shared neo4j-driver connection
          |
          v
CognoDB graph database
```

The frontend uses React Router for the `/learners`, `/path`, and `/gaps` screens. Its API service uses the browser's native `fetch` implementation and centralizes requests to the local backend.

## Graph Data Model

### Nodes

| Label | Properties |
| --- | --- |
| `Topic` | `id`, `name`, `description` |
| `TopicCluster` | `id`, `name` |
| `Learner` | `id`, `name` |

### Relationships

#### Core application relationships

```text
Learner
  |-- COMPLETED --> Topic
  `-- PENDING ----> Topic

Topic -- BELONGS_TO -------> TopicCluster
Topic -- PREREQUISITE_OF --> Topic
```

`A-[:PREREQUISITE_OF]->B` means that A must be learned before B. `PENDING` is an explicit learner assignment, not a value derived by subtracting completed topics from the complete curriculum. Every seeded topic belongs to one cluster.

These four relationships are the graph foundation for learner progress, next-topic recommendations, prerequisite path finding, and gap analysis.

The seed script creates uniqueness constraints for `Topic.id`, `TopicCluster.id`, and `Learner.id`. Its validation also checks for orphan topics, invalid cluster membership counts, and learners who have both `COMPLETED` and `PENDING` relationships to the same topic.

## Recommendation Logic

The recommendation query begins with the selected learner and collects their distinct completed topics. It then considers every curriculum topic the learner has not completed.

For each candidate, the query traverses incoming `PREREQUISITE_OF` paths of one or more relationships and collects all distinct direct and transitive prerequisites. The Cypher `all(...)` predicate requires every collected prerequisite to appear in the learner's completed-topic collection. A qualifying topic is returned with its cluster and prerequisite summary.

This logic is intentionally readiness-based rather than assignment-based: a recommended topic does not have to have an existing `PENDING` relationship. An incomplete topic with no prerequisites also qualifies because its prerequisite set is empty.

## Prerequisite Path Finder

The path finder accepts a source topic and a target topic and follows `PREREQUISITE_OF` relationships in their forward direction. It uses `shortestPath` with a minimum path length of one, so both direct and multi-hop dependencies are supported.

For example, a seeded DSA path can be:

```text
Arrays and Strings
        |
        v
Linked Lists
        |
        v
Trees
        |
        v
Graphs
```

The API returns the ordered topic nodes and a `hops` value. `hops` is the number of relationships in the path, converted from a Neo4j integer to a JavaScript number in the query module. The frontend preserves the ordered path visualization but presents a learner-focused count of intermediate topics as `hops - 1`. A direct one-hop path therefore has no intermediate topics.

If no directed path exists, the API returns an empty array and the frontend displays an empty state.

## Gap Analysis

Gap analysis starts from the selected learner's `PENDING` relationships. It does not treat every uncompleted curriculum topic as a gap. Each pending topic is followed through `BELONGS_TO`, then the results are grouped and ordered by `TopicCluster`.

The frontend displays each cluster's name, pending-topic count, topic names, and descriptions. This keeps explicit assignments separate from readiness recommendations.

## API Endpoints

The local API uses `http://localhost:3000` by default.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/learners` | List learner IDs and names. |
| `GET` | `/learners/:id/progress` | Return one learner with completed and pending topics; returns `404` when the learner is missing. |
| `GET` | `/learners/:id/recommendations` | Return readiness-based next-topic recommendations for a learner. |
| `GET` | `/topics` | List topics with their descriptions and clusters. |
| `GET` | `/topics/:id` | Return one topic and its cluster; returns `404` when the topic is missing. |
| `GET` | `/path?from=<topicId>&to=<topicId>` | Find a directed shortest prerequisite path. Both query parameters are required. |
| `GET` | `/gaps?learnerId=<learnerId>` | Group a learner's explicitly pending topics by cluster. `learnerId` is required. |

The topics router is also mounted at `/`, so `GET /` lists topics and `GET /:id` performs a topic lookup. Missing required query parameters for `/path` or `/gaps` produce a `400` response. Unexpected errors are logged by centralized Express error middleware and returned to clients as a generic `500` response.

## Project Structure

```text
.
|-- backend/
|   |-- db.js
|   |-- index.js
|   |-- queries/
|   |   |-- gapAnalysis.js
|   |   |-- learnerProgress.js
|   |   |-- learners.js
|   |   |-- nextTopics.js
|   |   |-- prerequisitePath.js
|   |   |-- topicById.js
|   |   `-- topics.js
|   `-- routes/
|       |-- gapsRoute.js
|       |-- learnersRoute.js
|       |-- pathRoute.js
|       `-- topicsRoute.js
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |   `-- api.js
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- package.json
|   `-- vite.config.js
|-- scripts/
|   `-- seed.js
|-- docs/
|   `-- dataModel.md
`-- package.json
```

## Setup

### Prerequisites

- Node.js and npm
- A CognoDB instance reachable through its Neo4j-compatible Bolt endpoint
- CognoDB connection credentials

No Node.js version is pinned in the repository.

### Installation

1. Clone the repository and enter its directory:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install backend dependencies from the repository root:

   ```bash
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. Create a root `.env` file and add the variables documented below.

5. Seed the database from the repository root:

   ```bash
   node scripts/seed.js
   ```

   The seed is idempotent: it uses parameterized `MERGE` operations for nodes and relationships and creates constraints with `IF NOT EXISTS`. It seeds DSA, SQL, TypeScript, and React clusters, their curriculum topics and prerequisites, learners, and progress.

## Environment Variables

`backend/db.js` reads these variables:

```dotenv
COGNODB_URI=bolt+s://<your-cognodb-host>
COGNODB_USER=<your-username>
COGNODB_PASSWORD=<your-password>
```

Store real credentials only in the root `.env` file. Do not commit that file or expose these values in client-side code. The frontend contains no database credentials; it communicates with the backend API.

## Running the Application

Start the backend from the repository root:

```bash
npm start
```

This runs `node backend/index.js`. For automatic backend restarts during development, use:

```bash
npm run dev
```

The backend listens on `PORT` when supplied to the process and otherwise defaults to port `3000`.

In a second terminal, start the frontend from `frontend/`:

```bash
cd frontend
npm run dev
```

Vite prints the frontend URL in the terminal. The current API service expects the backend at `http://localhost:3000`.

To create a frontend production bundle:

```bash
cd frontend
npm run build
```

## Testing

There is currently no automated backend test suite. The final manual regression audit passed these cases:

- topic and learner list retrieval;
- learner progress containing separate completed and pending collections;
- next-topic recommendations based on transitive prerequisite completion;
- a direct path such as `dsa-arrays` to `dsa-linked-lists`, with `hops: 1`;
- a multi-hop forward path such as `dsa-arrays` to `dsa-graphs`;
- a reverse lookup such as `dsa-graphs` to `dsa-arrays`, which has no directed path;
- gap analysis for a selected learner, grouped by topic cluster;
- `400` responses for missing `/path` and `/gaps` query parameters;
- `404` responses for missing learner progress and topic records;
- frontend loading, error, selection, and empty-result states;
- frontend ESLint checks;
- frontend production build.

Useful manual requests after starting and seeding the backend include:

```bash
curl http://localhost:3000/learners
curl http://localhost:3000/topics
curl http://localhost:3000/learners/learner-rohit/progress
curl http://localhost:3000/learners/learner-rohit/recommendations
curl "http://localhost:3000/path?from=dsa-arrays&to=dsa-linked-lists"
curl "http://localhost:3000/path?from=dsa-arrays&to=dsa-graphs"
curl "http://localhost:3000/path?from=dsa-graphs&to=dsa-arrays"
curl "http://localhost:3000/gaps?learnerId=learner-rohit"
```

Run the frontend's configured static checks from `frontend/`:

```bash
npm run lint
npm run build
```

These commands lint the frontend source and verify that Vite can create a production bundle; they are not a replacement for backend integration tests.

## Code Quality

- Cypher data values are supplied through parameters rather than interpolated into query strings.
- Database query modules open a session and close it in `finally` blocks.
- CognoDB credentials come from environment variables through one shared driver module.
- Express route modules remain thin and delegate graph access to dedicated query modules.
- Unexpected route errors flow to centralized Express error handling without exposing internal error details to clients.
- The frontend centralizes HTTP calls and error parsing in `src/services/api.js`.
- Shared React components provide consistent navigation, page headings, status states, and topic sections.
- The seed script uses `MERGE`, uniqueness constraints, data validation, and post-seed integrity queries.

## Known Limitations / Future Improvements

- **Restrict CORS in production:** the current backend enables `cors()` without an origin allowlist.
- **Add graceful shutdown:** the long-lived shared database driver is not explicitly closed on process termination.
- **Add backend regression tests:** route validation, graph-query behavior, missing records, and database failures are currently covered only by manual checks.
- **Make the frontend API URL configurable:** `src/services/api.js` currently fixes the backend base URL to `http://localhost:3000`.

## License

The root package metadata declares the project license as ISC. A standalone license file is not currently included in the repository.
