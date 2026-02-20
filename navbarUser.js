// navbarUser.js — FINAL PROFILE DROPDOWN

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("profile-container");
  if (!container) return;

  const userRaw = localStorage.getItem("user");
  if (!userRaw) return;

  const user = JSON.parse(userRaw);

  container.innerHTML = `
    <div class="profile-wrapper">
      <div class="profile-circle" id="profileBtn">
        ${user.name.charAt(0).toUpperCase()}
      </div>

      <div class="profile-dropdown" id="profileDropdown">
        <a href="profile.html">View Profile</a>
        <button id="logoutBtn">Logout</button>
      </div>
    </div>
  `;

  const profileBtn = document.getElementById("profileBtn");
  const dropdown = document.getElementById("profileDropdown");

  profileBtn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  // close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });
});