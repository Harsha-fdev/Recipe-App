const searchbox = document.querySelector(".search-box");//. is very important bcs u are using class and u see an error as script.js:5 Uncaught TypeError: Cannot read properties of null (reading 'addEventListener') at script.js:5:11
const searchbtn = document.querySelector(".search-btn");
const recipe_container = document.querySelector(".recipe-container");
const recipe_content = document.querySelector(".recipe-details-content");
const closeBtn = document.querySelector(".recipe-close-btn");


//function to fetch recipes
//async await is used to wait until api fetches complete info as it returns a promise so for that response is converted to json
const fetchrecipes = async (item) => {
    recipe_container.innerHTML = "<h2>Fetching Recipes...</h2>";

    try{
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`);
        const response = await data.json();
        // console.log(response);

        recipe_container.innerHTML = "";

        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
            <img src = "${meal.strMealThumb}">
            <h3> ${meal.strMeal}</h3>
            <p> <span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);
            button.addEventListener('click' , ()=>{
                openRecipePopup(meal);
            });
            recipe_container.appendChild(recipeDiv);
        });
    } 
    catch(error){
        recipe_container.innerHTML = `<h2>Error in fetching Recipe. . .</h2>`;
    }
}

const fetchIngredients = (meal)=>{
    const ingredientList = [];//since str is immutable in js so popup was not working so instead use an empty array and then join it as a str
    for(let i = 1; i <= 20; i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientList.push(`<li>${measure} ${ingredient}</li>`);
        }
        else{
            break;
        }
    }
    return ingredientList.join("");
}

const openRecipePopup = (meal)=>{
    recipe_content.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div>
        <h3>Instructions:</h3>
        <p class="recipeInstruction">${meal.strInstructions}</p>
    </div>
    `
    recipe_content.parentElement.style.display = "block";
}

searchbtn.addEventListener('click' , (e) => {
    e.preventDefault();//it prevents the form fromauto submiting please remove this line and observe page gets refreshed as soon as u click
    // console.log("clicked");
    const searchinput = searchbox.value.trim();
    if(!searchinput){
        recipe_container.innerHTML = `<h2>Type the meal in the search box.</h2>`;
        return;
    }
    fetchrecipes(searchinput);
});

closeBtn.addEventListener('click' , ()=>{
    recipe_content.parentElement.style.display = "none";
});