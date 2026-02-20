// navbarUser.js — FINAL, GUARANTEED

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("nav-user");
  if (!container) return;

  const userRaw = localStorage.getItem("user");
  if (!userRaw) return;

  const user = JSON.parse(userRaw);

  container.innerHTML = `
    <div class="user-menu">
      <span class="user-name">${user.name}</span>
      <div class="dropdown">
        <a href="profile.html">View Profile</a>
        <button id="logoutBtn">Logout</button>
      </div>
    </div>
  `;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
});