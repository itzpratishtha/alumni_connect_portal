// protect.js — redirects user to login if not authenticated
(function () {
  const publicPages = ["login.html", "register.html"];

  const currentPage = window.location.pathname.split("/").pop();

  // If page is public, do nothing
  if (publicPages.includes(currentPage)) return;

  // ✅ USE THE CORRECT TOKEN KEY
  const token = localStorage.getItem("auth_token");

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
  }

  // ❌ DO NOT validate token on page load (causes instant logout on network issues)
  // Token validation should be done only when calling protected APIs

})();
