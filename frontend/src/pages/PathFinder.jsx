import { useEffect, useState } from "react";
import { getPrerequisitePath, getTopics } from "../services/api.js";
import PageHeader from "../components/PageHeader.jsx";
import StatusState from "../components/StatusState.jsx";

function getIntermediateTopicsLabel(hops) {
  const intermediateTopics = hops - 1;

  if (intermediateTopics === 0) {
    return "No intermediate topics";
  }

  return `${intermediateTopics} ${intermediateTopics === 1 ? "topic" : "topics"} to cover`;
}

export default function PathFinder() {
  const [topics, setTopics] = useState([]);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [paths, setPaths] = useState(null);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [pathLoading, setPathLoading] = useState(false);
  const [topicsError, setTopicsError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [pathError, setPathError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadTopics() {
      try {
        const data = await getTopics();

        if (!ignore) {
          setTopics(data);
        }
      } catch (error) {
        if (!ignore) {
          setTopicsError(error.message || "Unable to load topics.");
        }
      } finally {
        if (!ignore) {
          setTopicsLoading(false);
        }
      }
    }

    loadTopics();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");
    setPathError("");
    setPaths(null);

    if (!fromId || !toId) {
      setValidationError("Select both a from topic and a to topic.");
      return;
    }

    if (fromId === toId) {
      setValidationError("Choose two different topics.");
      return;
    }

    setPathLoading(true);

    try {
      const data = await getPrerequisitePath(fromId, toId);
      setPaths(data);
    } catch (error) {
      setPathError(error.message || "Unable to find the prerequisite path.");
    } finally {
      setPathLoading(false);
    }
  }

  return (
    <main className="page path-page">
      <PageHeader
        eyebrow="Curriculum explorer"
        title="Prerequisite path finder"
        description="Trace the shortest learning sequence between two topics across the prerequisite graph."
      />

      {topicsLoading ? (
        <StatusState
          type="loading"
          title="Loading curriculum"
          message="Retrieving topics from the knowledge graph."
        />
      ) : null}

      {topicsError ? (
        <StatusState
          type="error"
          title="Unable to load topics"
          message={topicsError}
        />
      ) : null}

      {!topicsLoading && !topicsError && topics.length === 0 ? (
        <StatusState
          title="No topics available"
          message="Seed the curriculum before searching for a prerequisite path."
        />
      ) : null}

      {!topicsLoading && !topicsError && topics.length > 0 ? (
        <section className="path-builder" aria-labelledby="path-builder-heading">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Path parameters</p>
              <h2 id="path-builder-heading">Choose two topics</h2>
            </div>
            <p>Direction follows the curriculum from prerequisite to dependent topic.</p>
          </div>

          <form className="path-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="from-topic">From Topic</label>
            <select
              id="from-topic"
              value={fromId}
              onChange={(event) => setFromId(event.target.value)}
            >
              <option value="">Select a starting topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name} ({topic.cluster.name})
                </option>
              ))}
            </select>
          </div>

          <div className="path-form-divider" aria-hidden="true">to</div>

          <div className="form-field">
            <label htmlFor="to-topic">To Topic</label>
            <select
              id="to-topic"
              value={toId}
              onChange={(event) => setToId(event.target.value)}
            >
              <option value="">Select a destination topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name} ({topic.cluster.name})
                </option>
              ))}
            </select>
          </div>

          <button className="primary-button" type="submit" disabled={pathLoading}>
            {pathLoading ? "Finding Path..." : "Find Path"}
          </button>
          </form>
        </section>
      ) : null}

      {validationError ? (
        <StatusState type="error" title="Check your selections" message={validationError} />
      ) : null}

      {pathError ? (
        <StatusState type="error" title="Unable to find path" message={pathError} />
      ) : null}

      {pathLoading ? (
        <StatusState
          type="loading"
          title="Searching the graph"
          message="Traversing prerequisite relationships."
        />
      ) : null}

      {paths !== null && paths.length === 0 && !pathLoading && !pathError ? (
        <StatusState
          title="No prerequisite path found"
          message="No prerequisite path found between these topics. Try reversing the direction or selecting another pair."
        />
      ) : null}

      {paths && paths.length > 0 && !pathLoading && !pathError ? (
        <section className="path-results" aria-labelledby="path-results-heading">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Graph traversal</p>
              <h2 id="path-results-heading">Path results</h2>
            </div>
            <span className="count-badge">{paths.length}</span>
          </div>

          <ol className="path-result-list">
            {paths.map((result, index) => (
              <li
                className="path-result-card"
                key={`${result.path.map((topic) => topic.id).join("-")}-${index}`}
              >
                <div className="path-result-meta">
                  <span>Path {index + 1}</span>
                  <strong>{getIntermediateTopicsLabel(result.hops)}</strong>
                </div>

                <div className="path-flow">
                  {result.path.map((topic, topicIndex) => (
                    <div className="path-step" key={topic.id}>
                      <div className="path-node">
                        <span>{String(topicIndex + 1).padStart(2, "0")}</span>
                        <strong>{topic.name}</strong>
                      </div>
                      {topicIndex < result.path.length - 1 ? (
                        <div className="path-connector" aria-hidden="true">↓</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </main>
  );
}
