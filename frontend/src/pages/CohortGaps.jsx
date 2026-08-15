import { useEffect, useState } from "react";
import { getGaps, getLearners } from "../services/api.js";
import PageHeader from "../components/PageHeader.jsx";
import StatusState from "../components/StatusState.jsx";

export default function CohortGaps() {
  const [learners, setLearners] = useState([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState("");
  const [gaps, setGaps] = useState(null);
  const [learnersLoading, setLearnersLoading] = useState(true);
  const [gapsLoading, setGapsLoading] = useState(false);
  const [learnersError, setLearnersError] = useState("");
  const [gapsError, setGapsError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadLearners() {
      try {
        const data = await getLearners();

        if (!ignore) {
          setLearners(data);
        }
      } catch (error) {
        if (!ignore) {
          setLearnersError(error.message || "Unable to load learners.");
        }
      } finally {
        if (!ignore) {
          setLearnersLoading(false);
        }
      }
    }

    loadLearners();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedLearnerId) {
      return undefined;
    }

    let ignore = false;

    async function loadGaps() {
      setGapsLoading(true);
      setGapsError("");
      setGaps(null);

      try {
        const data = await getGaps(selectedLearnerId);

        if (!ignore) {
          setGaps(data);
        }
      } catch (error) {
        if (!ignore) {
          setGapsError(error.message || "Unable to load cohort gaps.");
        }
      } finally {
        if (!ignore) {
          setGapsLoading(false);
        }
      }
    }

    loadGaps();

    return () => {
      ignore = true;
    };
  }, [selectedLearnerId]);

  function handleLearnerChange(event) {
    setSelectedLearnerId(event.target.value);
    setGaps(null);
    setGapsError("");
  }

  const selectedLearner = learners.find(
    (learner) => learner.id === selectedLearnerId,
  );
  const totalPending = gaps?.reduce(
    (total, clusterGap) => total + clusterGap.topics.length,
    0,
  );

  return (
    <main className="page gaps-page">
      <PageHeader
        eyebrow="Assignment coverage"
        title="Cohort gaps"
        description="Inspect explicitly assigned topics by curriculum cluster and focus support where each learner needs it most."
      />

      {learnersLoading ? (
        <StatusState
          type="loading"
          title="Loading learners"
          message="Preparing cohort assignments."
        />
      ) : null}

      {learnersError ? (
        <StatusState
          type="error"
          title="Unable to load learners"
          message={learnersError}
        />
      ) : null}

      {!learnersLoading && !learnersError && learners.length === 0 ? (
        <StatusState
          title="No learners available"
          message="Add learners to the cohort before reviewing curriculum gaps."
        />
      ) : null}

      {!learnersLoading && !learnersError && learners.length > 0 ? (
        <section className="control-panel" aria-labelledby="gaps-control-heading">
          <div className="control-copy">
            <p className="section-kicker">Gap analysis</p>
            <h2 id="gaps-control-heading">Choose a learner</h2>
            <p>Pending topics are grouped by their assigned curriculum cluster.</p>
          </div>
          <div className="form-field form-field--compact">
            <label htmlFor="gaps-learner-select">Learner</label>
            <select
              id="gaps-learner-select"
              value={selectedLearnerId}
              onChange={handleLearnerChange}
            >
              <option value="">Select a learner</option>
              {learners.map((learner) => (
                <option key={learner.id} value={learner.id}>
                  {learner.name}
                </option>
              ))}
            </select>
          </div>
        </section>
      ) : null}

      {!selectedLearnerId && learners.length > 0 ? (
        <StatusState
          title="Select a learner"
          message="Choose someone from the cohort to view pending topics by cluster."
        />
      ) : null}

      {gapsLoading ? (
        <StatusState
          type="loading"
          title="Loading cohort gaps"
          message="Grouping pending assignments by curriculum area."
        />
      ) : null}

      {gapsError ? (
        <StatusState
          type="error"
          title="Unable to load cohort gaps"
          message={gapsError}
        />
      ) : null}

      {gaps !== null && gaps.length === 0 && !gapsLoading && !gapsError ? (
        <StatusState
          title="No pending gaps"
          message="This learner has no pending topic gaps."
        />
      ) : null}

      {gaps && gaps.length > 0 && !gapsLoading && !gapsError ? (
        <div className="gaps-dashboard">
          <section className="gap-summary" aria-label="Gap summary">
            <div>
              <p className="section-kicker">Selected learner</p>
              <h2>{selectedLearner?.name}</h2>
              <p>Assigned topics still requiring completion</p>
            </div>
            <dl>
              <div>
                <dt>Pending topics</dt>
                <dd>{totalPending}</dd>
              </div>
              <div>
                <dt>Active clusters</dt>
                <dd>{gaps.length}</dd>
              </div>
            </dl>
          </section>

          <div className="cluster-grid">
          {gaps.map(({ cluster, topics }) => (
            <section
              className="cluster-card"
              key={cluster.id}
              aria-labelledby={`${cluster.id}-gaps-heading`}
            >
              <div className="cluster-card-header">
                <div>
                  <p className="section-kicker">Topic cluster</p>
                  <h2 id={`${cluster.id}-gaps-heading`}>{cluster.name}</h2>
                </div>
                <div className="pending-count">
                  <strong>{topics.length}</strong>
                  <span>pending</span>
                </div>
              </div>

              <ul className="gap-topic-list">
                {topics.map((topic) => (
                  <li key={topic.id}>
                    <article className="gap-topic-card">
                      <span className="topic-status-dot" aria-hidden="true" />
                      <h3>{topic.name}</h3>
                      <p>{topic.description}</p>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          </div>
        </div>
      ) : null}
    </main>
  );
}
