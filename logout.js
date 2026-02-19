// logout.js — global logout handler

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      localStorage.removeItem("auth_token");
      window.location.href = "login.html";
    }
  });
});
