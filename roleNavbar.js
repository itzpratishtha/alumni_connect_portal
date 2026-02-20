document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  document.querySelectorAll("[data-role]").forEach(el => {
    const allowed = el.dataset.role.split(",");
    if (!allowed.includes(user.role)) {
      el.remove();
    }
  });
});