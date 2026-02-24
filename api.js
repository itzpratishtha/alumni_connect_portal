// ===============================
// 🔗 BACKEND BASE URL
// ===============================
const API_BASE = "https://alumni-connect-portal-w0fm.onrender.com";

// ===============================
// 🌐 CORE API CALL
// ===============================
async function apiCall(endpoint, method = "GET", data = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include" // 🔐 cookie auto-sent
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(API_BASE + endpoint, options);
  const result = await response.json();

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
    role
  });
}

// ===============================
// ✅ LOGIN USER
// ===============================
async function loginUser(email, password) {
  // Cookie is set by backend automatically
  return apiCall("/api/auth/login", "POST", {
    email,
    password
  });
}

// ===============================
// ✅ LOGOUT USER
// ===============================
async function logoutUser() {
  await apiCall("/api/auth/logout", "POST");
  window.location.href = "login.html";
}

// ===============================
// 🧪 DEBUG (optional)
// ===============================
window.API_DEBUG = {
  registerUser,
  loginUser,
  logoutUser
};