document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const name = user.name;
  const photo = user.profilePhoto;


  // ✅ correct backend URL
  const backendURL = "https://alumni-connect-portal-w0fm.onrender.com";

  const navUser = document.getElementById("navUser");
  if (!name || !navUser) return;

  // decide avatar (photo or letter)
  const avatarHTML = photo
    ? `<img src="${backendURL}${photo}" class="avatar-img" alt="Profile">`
    : `<div class="avatar">${name.charAt(0).toUpperCase()}</div>`;

  navUser.innerHTML = `
    <div class="user-menu">
      <div class="user-trigger" id="userTrigger">
        ${avatarHTML}
        <span>${name}</span>
      </div>

      <div class="user-dropdown" id="userDropdown">
        <a href="profile.html">Profile</a>
        <a href="#" id="logoutBtn">Logout</a>
      </div>
    </div>
  `;

  // toggle dropdown
  document.getElementById("userTrigger").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("userDropdown").classList.toggle("show");
  });

  // logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  // close dropdown on outside click
  document.addEventListener("click", () => {
    document.getElementById("userDropdown").classList.remove("show");
  });

});
