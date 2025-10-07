document.addEventListener("DOMContentLoaded", () => {
  localStorage.clear();
  const form = document.querySelector("form");
  const btn = document.getElementById("loginButton");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const message = document.getElementById("message");
  const loading = document.getElementById("loading");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 300);

    if (!username.value.trim() || !password.value.trim()) {
      message.textContent = "Username dan password harus diisi.";
      message.style.color = "#d32f2f";
      return;
    }
    message.textContent = "";
  });
});


const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function(event) {
  event.preventDefault(); 

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const btn = document.getElementById("loginButton");

  loading.style.display = "flex";
  btn.disabled = true;
  message.style.display = "none";

  fetch("https://dummyjson.com/users")
    .then((response) => response.json())
    .then((data) => {
      const user = data.users.find((u) => u.username === username && u.password === password);
      if (user) {
        message.textContent = "Login successful!\nYou will be redirected shortly.";
        message.style.color = "#4caf50";
        localStorage.setItem("firstName", user.firstName);
        setTimeout(() => {
          window.location.href = "/recipe/";
        }, 1000);
      
      } else {
        message.textContent = "Incorrect username or password.";
        message.style.color = "#d32f2f";
      
      }
    })
    .catch((error) => {
      message.textContent = "An error occurred. Please try again.";
      message.style.color = "#d32f2f";
    
    })
    .finally(() => {
      loading.style.display = "none";
      loginButton.disabled = false;
      message.style.display = "block";
    });
});