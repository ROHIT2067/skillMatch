const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function requestJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const body = await response.json();

      if (body.error) {
        message = body.error;
      }
    } catch {
      // Keep the status-based message when the response is not JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getLearners() {
  return requestJson("/learners");
}

export async function getLearnerProgress(learnerId) {
  const id = encodeURIComponent(learnerId);
  return requestJson(`/learners/${id}/progress`);
}

export async function getLearnerRecommendations(learnerId) {
  const id = encodeURIComponent(learnerId);
  return requestJson(`/learners/${id}/recommendations`);
}

export async function getPrerequisitePath(fromId, toId) {
  const params = new URLSearchParams({
    from: fromId,
    to: toId,
  });

  return requestJson(`/path?${params.toString()}`);
}

export async function getGaps(learnerId) {
  const params = new URLSearchParams({ learnerId });
  return requestJson(`/gaps?${params.toString()}`);
}

export async function getTopics() {
  return requestJson("/topics");
}

export async function getTopicById(topicId) {
  const id = encodeURIComponent(topicId);
  return requestJson(`/topics/${id}`);
}
