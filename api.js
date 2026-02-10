const BASE_URL = "https://alumni-connect-portal-jba5.onrender.com";


async function apiCall(endpoint, method = "GET", body = null, isFormData = false) {
  const token = localStorage.getItem("token");

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // If not FormData, send JSON
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  // ✅ Read response safely (JSON or TEXT)
  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    // Backend didn't return JSON
    throw new Error(text || "Server did not return JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
