document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("button");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 300);
  });
});
