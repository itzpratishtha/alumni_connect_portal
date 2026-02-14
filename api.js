// ===============================
// 🔗 BACKEND BASE URL (Railway)
// ===============================
const API_BASE =
  "https://studentalumniconnectportal-production-be61.up.railway.app";

// ===============================
// 🔧 Generic API call helper
// ===============================
async function apiCall(endpoint, method = "GET", data = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, options);
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    throw new Error("Unable to connect to server");
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

// ===============================
// ✅ REGISTER USER
// ===============================
async function registerUser(name, email, password, role) {
  return apiCall("/api/auth/register", "POST", {
    name,
    email,
    password,
    role,
  });
}

// ===============================
// ✅ LOGIN USER
// ===============================
async function loginUser(email, password) {
  const res = await apiCall("/api/auth/login", "POST", {
    email,
    password,
  });

  // Save token + user
  localStorage.setItem("auth_token", res.token);
  localStorage.setItem("auth_user", JSON.stringify(res.user));

  return res;
}

// ===============================
// 🔐 GET AUTH TOKEN
// ===============================
function getAuthToken() {
  return localStorage.getItem("auth_token");
}

// ===============================
// 🔐 LOGOUT USER
// ===============================
function logoutUser() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  window.location.href = "login.html";
}

// ===============================
// 🔐 PROTECTED API CALL
// ===============================
async function protectedApiCall(endpoint, method = "GET", data = null) {
  const token = getAuthToken();
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  return apiCall(endpoint, method, data, token);
}

// ===============================
// 🧪 DEBUG (optional)
// ===============================
window.API_DEBUG = {
  registerUser,
  loginUser,
  logoutUser,
};
