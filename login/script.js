document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const btn = document.querySelector("button");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const message = document.getElementById("message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 300);

    // Validation
    if (!username.value.trim() || !password.value.trim()) {
      message.textContent = "Username dan password harus diisi.";
      message.style.color = "#d32f2f";
      return;
    }
    message.textContent = "";
    // Continue with login logic here if needed
  });
});
