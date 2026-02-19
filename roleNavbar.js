// roleNavbar.js — FINAL & CORRECT

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const role = user.role;

  document.querySelectorAll("[data-role]").forEach(el => {
    const allowedRoles = el.dataset.role.split(",");
    if (!allowedRoles.includes(role)) {
      el.style.display = "none";
    }
  });
});
