// protect.js — redirects user to login if not authenticated

(function() {
  const publicPages = ["login.html", "register.html"];

  const currentPage = window.location.pathname.split("/").pop();

  // If page is public, do nothing
  if (publicPages.includes(currentPage)) return;

  // If token is missing → redirect to login
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  // Optional: Validate token by hitting backend
  fetch("http://localhost:5001/api/auth/verify", {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => {
      if (!res.ok) {
        localStorage.clear();
        window.location.href = "login.html";
      }
    })
    .catch(() => {
      localStorage.clear();
      window.location.href = "login.html";
    });

})();
