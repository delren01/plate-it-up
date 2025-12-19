const searchBtn = document.getElementById("search-btn");
const ingredientInput = document.getElementById("ingredient-input");
const mealList = document.getElementById("meal-list");
const recipeModal = document.getElementById("recipe-modal");
const recipeDetails = document.getElementById("recipe-details");
const closeBtn = document.querySelector(".close-btn");
const resetBtn = document.getElementById("reset-btn");

function ingredientSearch() {
    let ingredientName = ingredientInput.value;
    if (ingredientName) getMeals(ingredientName);
}

searchBtn.addEventListener("click", ingredientSearch);

async function getMeals(ingredient) {
    try {
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
        mealList.innerHTML = "Loading...";
        let response = await fetch(url); // Fetches the data (waits for server)
        let data = await response.json(); // Unpacks the data (wait for conversion)
        displayMeals(data.meals); // Hand off data to the UI
    } catch (error) {
        console.error("Something went wrong: ", error);
    }
};

function displayMeals(meals) {
    mealList.innerHTML = "";
    if (meals === null) {
        console.log("No meals found. Please try again.");
        mealList.innerHTML += `<p>No meals found.</p>`
        return;
    }
    meals.forEach((meal) => {
       const newDiv = document.createElement("div");
       newDiv.classList.add("meal-card");
       newDiv.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}">
       <h3>${meal.strMeal}</h3>`;

       newDiv.addEventListener("click", () => getRecipeDetails(meal.idMeal));
       mealList.appendChild(newDiv);
    });
}

async function getRecipeDetails(id) {
    try {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        displayRecipe(data.meals[0]);
    } catch (error) {
        console.error("Something went wrong: ", error);
    }
}

function displayRecipe(meal) {
    recipeDetails.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h2>${meal.strMeal}</h2>
    <h3>Category: ${meal.strCategory}</h3>
    <p>${meal.strInstructions}</p>
    <a href="${meal.strYoutube}" class="link" target="_blank">Watch Tutorial</a>`;
    recipeModal.style.display = "flex";
}

closeBtn.addEventListener("click", () => {
    recipeModal.style.display = "none";
});

ingredientInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") ingredientSearch();
});

recipeModal.addEventListener("click", (e) => {
    // Only close if (e.target) IS the recipeModal
    if (e.target === recipeModal) {
        recipeModal.style.display = "none";
    }
}); 

resetBtn.addEventListener("click", () => {
    ingredientInput.value = "";
    mealList.innerHTML = "";
})