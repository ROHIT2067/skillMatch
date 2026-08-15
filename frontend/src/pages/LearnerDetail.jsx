import { useEffect, useState } from "react";
import {
  getLearners,
  getLearnerProgress,
  getLearnerRecommendations,
} from "../services/api.js";
import PageHeader from "../components/PageHeader.jsx";
import StatusState from "../components/StatusState.jsx";
import TopicSection from "../components/TopicSection.jsx";

export default function LearnerDetail() {
  const [learners, setLearners] = useState([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState("");
  const [progress, setProgress] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [learnersLoading, setLearnersLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [learnersError, setLearnersError] = useState("");
  const [detailError, setDetailError] = useState("");

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

    async function loadLearnerDetail() {
      setDetailLoading(true);
      setDetailError("");
      setProgress(null);
      setRecommendations([]);

      try {
        const [progressData, recommendationData] = await Promise.all([
          getLearnerProgress(selectedLearnerId),
          getLearnerRecommendations(selectedLearnerId),
        ]);

        if (!ignore) {
          setProgress(progressData);
          setRecommendations(recommendationData);
        }
      } catch (error) {
        if (!ignore) {
          setDetailError(error.message || "Unable to load learner details.");
        }
      } finally {
        if (!ignore) {
          setDetailLoading(false);
        }
      }
    }

    loadLearnerDetail();

    return () => {
      ignore = true;
    };
  }, [selectedLearnerId]);

  function handleLearnerChange(event) {
    setSelectedLearnerId(event.target.value);
    setProgress(null);
    setRecommendations([]);
    setDetailError("");
  }

  return (
    <main className="page learner-page">
      <PageHeader
        eyebrow="Skill Path Navigator"
        title="Learner progress"
        description="Review completed work, active assignments, and the next topics each learner is ready to take on."
      />

      {learnersLoading ? (
        <StatusState
          type="loading"
          title="Loading learners"
          message="Preparing the cohort workspace."
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
          message="Add learners to the cohort before reviewing progress."
        />
      ) : null}

      {!learnersLoading && !learnersError && learners.length > 0 ? (
        <section className="control-panel" aria-labelledby="learner-control-heading">
          <div className="control-copy">
            <p className="section-kicker">Cohort browser</p>
            <h2 id="learner-control-heading">Choose a learner</h2>
            <p>Switch learners to inspect their current curriculum position.</p>
          </div>
          <div className="form-field form-field--compact">
            <label htmlFor="learner-select">Learner</label>
          <select
            id="learner-select"
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
          message="Choose someone from the cohort to view progress and recommendations."
        />
      ) : null}

      {detailLoading ? (
        <StatusState
          type="loading"
          title="Loading learner details"
          message="Evaluating progress and prerequisite readiness."
        />
      ) : null}

      {detailError ? (
        <StatusState
          type="error"
          title="Unable to load learner details"
          message={detailError}
        />
      ) : null}

      {progress && !detailLoading && !detailError ? (
        <div className="learner-dashboard">
          <section className="learner-overview" aria-labelledby="learner-name">
            <div className="learner-identity">
              <div className="learner-avatar" aria-hidden="true">
                {progress.learner.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="section-kicker">Active learner</p>
                <h2 id="learner-name">{progress.learner.name}</h2>
                <p>Curriculum progress at a glance</p>
              </div>
            </div>

            <dl className="learner-stats">
              <div>
                <dt>Completed</dt>
                <dd>{progress.completed.length}</dd>
              </div>
              <div>
                <dt>Pending</dt>
                <dd>{progress.pending.length}</dd>
              </div>
              <div>
                <dt>Ready next</dt>
                <dd>{recommendations.length}</dd>
              </div>
            </dl>
          </section>

          <div className="topic-sections">
            <TopicSection
              title="Completed Topics"
              topics={progress.completed}
              emptyMessage="This learner has no completed topics."
              variant="completed"
            />

            <TopicSection
              title="Pending Topics"
              topics={progress.pending}
              emptyMessage="This learner has no pending topics."
              variant="pending"
            />

            <TopicSection
              title="Recommended Next Topics"
              topics={recommendations}
              emptyMessage="There are no recommended next topics."
              showCluster
              variant="recommended"
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
