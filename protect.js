// protect.js — backend-driven route protection (UX only)

(function () {
  const publicPages = ["login.html", "register.html"];
  const currentPage = window.location.pathname.split("/").pop();

  // Allow public pages
  if (publicPages.includes(currentPage)) return;

  // Verify authentication via backend
  apiCall("/api/auth/me")
    .catch(() => {
      window.location.href = "login.html";
    });
})();