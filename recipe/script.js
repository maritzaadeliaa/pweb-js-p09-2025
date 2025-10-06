document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filterSelect");
  const cards = document.querySelectorAll(".recipe-card");

  function filterRecipes() {
    const searchText = searchInput.value.toLowerCase();
    const filter = filterSelect.value;

    cards.forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      const text = card.querySelector(".recipe-info p").textContent.toLowerCase();

      const matchesSearch = name.includes(searchText) || text.includes(searchText);
      const matchesFilter =
        filter === "all" || card.textContent.toLowerCase().includes(filter);

      card.style.display = matchesSearch && matchesFilter ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", filterRecipes);
  filterSelect.addEventListener("change", filterRecipes);
});
