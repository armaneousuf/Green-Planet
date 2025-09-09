document.addEventListener("DOMContentLoaded", () => {
  const plantGrid = document.getElementById("plant-grid");
  const categoriesList = document.getElementById("categories-list");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalPriceEl = document.getElementById("cart-total-price");
  const loadingSpinner = document.getElementById("loading-spinner");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const closeModalBtn = document.getElementById("close-modal-btn");

  let currentPlants = [];
  let cart = [];

  async function fetchCategories() {
    try {
      const response = await fetch(
        "https://openapi.programming-hero.com/api/categories"
      );
      const data = await response.json();
      displayCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchAllPlants() {
    showSpinner(true);
    try {
      const response = await fetch(
        "https://openapi.programming-hero.com/api/plants"
      );
      const data = await response.json();
      currentPlants = data.plants;
      displayPlants(currentPlants);
    } catch (error) {
      console.error("Error fetching all plants:", error);
      plantGrid.innerHTML = "<p>Failed to load plants.</p>";
    } finally {
      showSpinner(false);
    }
  }

  async function fetchPlantsByCategory(categoryId) {
    showSpinner(true);
    try {
      const response = await fetch(
        `https://openapi.programming-hero.com/api/category/${categoryId}`
      );
      const data = await response.json();
      currentPlants = data.plants;
      displayPlants(currentPlants);
    } catch (error) {
      console.error(`Error fetching plants for category ${categoryId}:`, error);
      plantGrid.innerHTML = "<p>Failed to load plants for this category.</p>";
    } finally {
      showSpinner(false);
    }
  }

  async function fetchPlantDetails(plantId) {
    try {
      const response = await fetch(
        `https://openapi.programming-hero.com/api/plants/${plantId}`
      );

      if (!response.ok) {
        console.error(`API request failed with status: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data.plant || data.data || null;
    } catch (error) {
      console.error(`Error fetching details for plant ${plantId}:`, error);
      return null;
    }
  } //  Display Functions

  function displayCategories(categories) {
    categoriesList.innerHTML =
      '<li class="active" data-id="all">All Trees</li>';
    categories.forEach((category) => {
      const li = document.createElement("li");
      li.textContent = category.category_name;
      li.setAttribute("data-id", category.id);
      categoriesList.appendChild(li);
    });
  }

  function displayPlants(plants) {
    plantGrid.innerHTML = "";
    if (!plants || plants.length === 0) {
      plantGrid.innerHTML = "<p>No plants found in this category.</p>";
      return;
    }
    plants.forEach((plant) => {
      const plantCard = document.createElement("div");
      plantCard.classList.add("plant-card");
      plantCard.innerHTML = `
<img src="${plant.image}" alt="${plant.name}">
<h4 data-id="${plant.id}">${plant.name}</h4>
<p>${plant.description.slice(0, 100)}...</p>
<span class="category-tag">${plant.category}</span>
 <div class="price">৳${plant.price}</div>
 <button class="btn add-to-cart-btn" data-id="${
   plant.id
 }">Add to Cart</button>`;
      plantGrid.appendChild(plantCard);
    });
  }

  function showSpinner(show) {
    if (show) {
      plantGrid.innerHTML = "";
      plantGrid.appendChild(loadingSpinner);
      loadingSpinner.style.display = "block";
    } else {
      loadingSpinner.style.display = "none";
    }
  }

  function addToCart(plantId) {
    const plant = currentPlants.find((p) => p.id == plantId);
    if (!plant) {
      console.log("Plant not found with ID:", plantId);
      return;
    }

    const existingItem = cart.find((item) => item.id == plantId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...plant, quantity: 1 });
    }
    updateCartDisplay();
  }

  function removeFromCart(plantId) {
    cart = cart.filter((item) => item.id != plantId);
    updateCartDisplay();
  }

  function updateCartDisplay() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      cartItemsContainer.innerHTML = cart
        .map(
          (item) => `
 <div class="cart-item">
 <span>${item.name} (x${item.quantity})</span>
 <span>
 ৳${item.price * item.quantity}
 <span class="remove-btn" data-id="${item.id}">❌</span>
 </span>
 </div>
`
        )
        .join("");
    }
    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    cartTotalPriceEl.textContent = `৳${totalPrice}`;
  } // Modal Functionality

  async function openModal(plantId) {
    modal.style.display = "flex";
    modalBody.innerHTML = "";

    const modalSpinner = document.createElement("div");
    modalSpinner.className = "spinner";
    modalBody.appendChild(modalSpinner);

    const plant = await fetchPlantDetails(plantId);

    if (plant) {
      modalBody.innerHTML = `
<img src="${plant.image}" alt="${plant.name}">
<h2>${plant.name}</h2> 
<p><strong>Category:</strong> ${plant.category}</p>
 <p>${plant.description}</p>
 <h3>Price: ৳${plant.price}</h3>
 `;
    } else {
      modalBody.innerHTML = "<p>Could not load plant details.</p>";
    }
  }

  function closeModal() {
    modal.style.display = "none";
  }

  categoriesList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      const categoryId = e.target.getAttribute("data-id");
      document
        .querySelectorAll("#categories-list li")
        .forEach((item) => item.classList.remove("active"));
      e.target.classList.add("active");

      if (categoryId === "all") {
        fetchAllPlants();
      } else {
        fetchPlantsByCategory(categoryId);
      }
    }
  });

  plantGrid.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("add-to-cart-btn")) {
      const plantId = target.getAttribute("data-id");
      addToCart(plantId);
    }
    if (target.tagName === "H4") {
      const plantId = target.getAttribute("data-id");
      openModal(plantId);
    }
  });

  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const plantId = e.target.getAttribute("data-id");
      removeFromCart(plantId);
    }
  });

  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  async function initialize() {
    await fetchCategories();
    await fetchAllPlants();
  }

  initialize();
});
