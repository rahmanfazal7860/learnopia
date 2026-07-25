const BASE_URL = ""; // proxied to http://localhost:5000 in dev via vite.config.js

export async function api(path, { method = "GET", body, token } = {}) {
  const authToken = token || localStorage.getItem("learnopia_token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}
