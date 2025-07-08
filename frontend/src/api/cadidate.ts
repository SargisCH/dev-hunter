const baseUrl = import.meta.env.REACT_API_URL || "http://localhost:3000/api";

export const generateCandidates = async () => {
  return fetch(`${baseUrl}/candidate/generate`, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": localStorage.getItem("clientId") || "",
    },
    body: JSON.stringify({}),
  }).then((res) => res.json());
};
