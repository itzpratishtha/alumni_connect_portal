// protect.js

(async function () {
  const publicPages = ["login.html", "register.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (publicPages.includes(currentPage)) return;

  try {
    document.body.style.visibility = "hidden";

    await apiCall("/api/auth/me");

    document.body.style.visibility = "visible";

  } catch (err) {
    window.location.replace("login.html");
  }
})();