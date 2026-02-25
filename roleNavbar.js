document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(API_BASE + "/api/auth/me", {
      credentials: "include"
    });
    if (!res.ok) return;

    const user = await res.json();

    document.querySelectorAll("[data-role]").forEach(el => {
      const allowed = el.dataset.role.split(",");
      if (!allowed.includes(user.role)) {
        el.remove();
      }
    });
  } catch (err) {
    console.error("Role navbar failed");
  }
});