const baseUrl = import.meta.env.REACT_API_URL || "http://localhost:3000/api";

export const createSubscriptions = async (body) => {
  return fetch(`${baseUrl}/subscription/create`, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": localStorage.getItem("clientId") || "",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
};

export const getSubscriptions = async () => {
  return fetch(`${baseUrl}/subscription/`, {
    headers: {
      "x-client-id": localStorage.getItem("clientId") || "",
    },
  }).then((res) => res.json());
};

export const getSubscriptionCandidates = async (subscriptionId: string) => {
  return fetch(`${baseUrl}/subscription/${subscriptionId}/candidates`, {
    headers: {
      "x-client-id": localStorage.getItem("clientId") || "",
    },
  }).then((res) => res.json());
};

export const addCandidatesForSubscription = async (subscriptionId: string) => {
  return fetch(`${baseUrl}/subscription/${subscriptionId}/candidates/add`, {
    method: "Post",
    headers: {
      "x-client-id": localStorage.getItem("clientId") || "",
    },
  }).then((res) => res.json());
};
