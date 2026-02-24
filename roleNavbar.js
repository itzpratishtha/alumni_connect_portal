
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Get authenticated user from backend
    const user = await apiCall("/api/auth/me");

    document.querySelectorAll("[data-role]").forEach(el => {
      const allowedRoles = el.dataset.role.split(",");
      if (!allowedRoles.includes(user.role)) {
        el.remove();
      }
    });

  } catch (err) {
    // If not authenticated, do nothing
    // protect.js will handle redirect
    console.error("ROLE NAVBAR ERROR:", err);
  }
});