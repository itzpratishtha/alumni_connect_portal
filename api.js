const BASE_URL = "https://studentalumniconnectportal-production-be61.up.railway.app";

window.apiCall = async function (endpoint, method = "GET", body = null, isFormData = false) {
  const token = localStorage.getItem("token");

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const options = { method, headers };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(text || "Server did not return JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
