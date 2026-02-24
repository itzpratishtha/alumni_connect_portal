document.addEventListener("DOMContentLoaded", () => {
  const navbarRight = document.getElementById("navbarUser");

  if (!navbarRight) return;

  const user = await apiCall("/api/auth/me");

  // ❌ Not logged in
  if (!user) return;

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "profile-wrapper";

  // Create avatar
  const avatar = document.createElement("img");
  avatar.className = "profile-avatar";

  if (user.photo) {
    avatar.src = API_BASE + user.photo;
  } else {
    avatar.src =
      "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(user.name);
  }

  // Dropdown
  const dropdown = document.createElement("div");
  dropdown.className = "profile-dropdown";
  dropdown.innerHTML = `
    <a href="profile.html">View Profile</a>
    <button id="logoutBtn">Logout</button>
  `;

  wrapper.appendChild(avatar);
  wrapper.appendChild(dropdown);
  navbarRight.appendChild(wrapper);

  // Toggle dropdown
  avatar.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
});