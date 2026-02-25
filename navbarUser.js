document.addEventListener("DOMContentLoaded", async () => {
  const navbarRight = document.getElementById("navbarUser");
  if (!navbarRight) return;

  try {
    const user = await apiCall("/api/auth/me");

    // If not logged in, do nothing
    if (!user) return;

    // Wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "profile-wrapper";

    // Avatar
    const avatar = document.createElement("img");
    avatar.className = "profile-avatar";
    avatar.src = user.photo
      ? API_BASE + user.photo
      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name);

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

    // Logout (COOKIE-BASED)
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await apiCall("/api/auth/logout", "POST");
      sessionStorage.clear();
      window.location.href = "login.html";
    });

  } catch (err) {
    console.error("Navbar user load failed", err);
  }
});