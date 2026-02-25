document.addEventListener("DOMContentLoaded", async () => {
  const navbarRight = document.getElementById("navbarUser");
  if (!navbarRight) return;

  try {
    const user = await apiCall("/api/auth/me");

    if (!user) return;

    // Clear old content (important after profile update)
    navbarRight.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "profile-wrapper";

    const avatar = document.createElement("img");
    avatar.className = "profile-avatar";

    avatar.src = user.photo
      ? API_BASE + user.photo + "?t=" + Date.now() // 🔥 cache-bust
      : "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(user.name || "User");

    const dropdown = document.createElement("div");
    dropdown.className = "profile-dropdown";
    dropdown.innerHTML = `
      <a href="profile.html">View Profile</a>
      <button id="logoutBtn">Logout</button>
    `;

    wrapper.appendChild(avatar);
    wrapper.appendChild(dropdown);
    navbarRight.appendChild(wrapper);

    avatar.addEventListener("click", () => {
      dropdown.classList.toggle("show");
    });

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await apiCall("/api/auth/logout", "POST");
      sessionStorage.clear();
      window.location.href = "login.html";
    });

  } catch (err) {
    console.error("Navbar load failed", err);
  }
});