// roleNavbar.js — show/hide navbar items based on role

(function () {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token || !role) return;

  const links = document.querySelectorAll("[data-role]");

  links.forEach(link => {
    const allowedRoles = link.dataset.role.split(",");

    if (!allowedRoles.includes(role)) {
      link.style.display = "none";
    }
  });

})();

document.querySelectorAll("[data-role]").forEach(el => {
  const allowedRoles = el.dataset.role.split(",");
  if (!allowedRoles.includes(role)) {
    el.style.display = "none";
  }
});
