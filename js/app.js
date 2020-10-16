const favorites = document.querySelector('.favorites');
const form = document.querySelector('#form');
const randomCocktail = document.querySelector('#random-cocktail');
const sectionBottom = document.querySelector('.section__bottom');
const modal = document.querySelector('.modal');


// Comunications with server for random cocktail
const getRandomCocktail = async () => {
    const response = await fetch ('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const data = await response.json();
    addToUi(data.drinks[0]);
}

// Comunications with server for cocktail by name
const searchByName = async (name) => {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
    const data = await response.json();
    return data.drinks;
}

// add element to UI
function addToUi(data){
    const cocktailBox = document.createElement('div');
    cocktailBox.classList.add('cocktail-box');
    cocktailBox.innerHTML = `
        <span class="cocktail-name">${data.strDrink}</span>
        <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="cocktail-img">
        <span class="cocktail-heart">&#10084</span>
    `
    sectionBottom.appendChild(cocktailBox);
}

// Remove all cocktails
const removeAllCocktails = () => {
    while(sectionBottom.hasChildNodes()){
        sectionBottom.removeChild(sectionBottom.firstChild);
    }
}


function createFavorites(img, name) {
    const favoritesBox = document.createElement('div');
    favoritesBox.classList.add('favorites__box');
    favoritesBox.innerHTML = `
        <span class="favorites__delete">&#215;</span>
        <img src="${img}" alt="${name}" class="favorites__img">
        <small class="favorites__cocktail-name">${name}</small>
    `
    favorites.appendChild(favoritesBox);

    favoritesBox.addEventListener('click', function(e) {
        console.log(e.target);
        if(e.target.classList.contains('favorites__delete')){
            favoritesBox.remove();
            localStorage.removeItem(name)
            toggleFavorites();
        } else if(e.target.classList.contains('favorites__cocktail-name')){
            searchByName(name)
                .then(data => fillModalWithData(data))
                .catch(err => console.log(err));
                modal.classList.add('active');
        }
        
    })
}

// Display elements from LocalStorage to Favorites section
const showFavoritesFromLs = () => {

    for (var i = 0; i < localStorage.length; i++){
        const obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        createFavorites(obj.imgSrc, obj.cocktail)
     }
}

// Keep favorites container depends does Local Storage have items
const toggleFavorites = () => {
    const favorites = document.querySelector('.favorites');
    if(localStorage.length < 1){
        favorites.style.display = 'none';
    } else {
        favorites.style.display = 'flex';
    }
}

// Entering data to modal
const fillModalWithData = (data) => {
    const objData = data[0];
    modal.querySelector('.heading-second').innerText = data[0].strDrink;
    modal.querySelector('.modal__img').src = data[0].strDrinkThumb;
    modal.querySelector('.how-to').innerText = data[0].strInstructions;

    for(let i = 1; i <= 15; i++){
        let ingredient = 'strIngredient' + i;
        let measure = 'strMeasure' + i;

        const li = document.createElement('li');

        if(objData[ingredient] !== null){
            if(objData[measure] !== null){
                li.innerText = `${objData[ingredient]} - ${objData[measure]}`;
            } else {
                li.innerText = objData[ingredient];
            }

            li.classList.add('ingredient__item');
            document.querySelector('.ingredient').appendChild(li);
        }
    }
}


// LISTENERS
// Get rando cocktail from server and display only that one in UI
randomCocktail.addEventListener('click', function(){
    removeAllCocktails();
    getRandomCocktail();
    toggleFavorites();
});

// Search for cocktails by name and display them in UI
form.addEventListener('submit', function(e){
    removeAllCocktails();

    const cocktail = form.querySelector('.input__text').value;
    
    searchByName(cocktail)
        .then(data => {
            for(let element of data){
                addToUi(element);
            }
        })
        .catch(err => console.log(err))
    e.preventDefault();
})


sectionBottom.addEventListener('click', function(e){
    const target = e.target;
    
    // If click on cocktail name open modal with inforamtion of that.
    if(target.classList.contains('cocktail-name')){
        let name = target.innerText;
        searchByName(name)
            .then(data => fillModalWithData(data))
            .catch(err => console.log(err));

        modal.classList.add('active')

    // If click on heart inser data in LocalStorage and than load it in favorites section
    } else if (target.classList.contains('cocktail-heart')) {

        // Get information about cocktail
        const parentEl = target.parentElement;
        const img = parentEl.querySelector('.cocktail-img').src;
        const name = parentEl.querySelector('.cocktail-name').innerText;

        // Put it in local storage
        if(!localStorage.getItem(name)){
            const localObj = {cocktail: name, imgSrc: img};
            localStorage.setItem(name, JSON.stringify(localObj))

            const objLocal = JSON.parse(localStorage.getItem(name));

            createFavorites(objLocal.imgSrc, objLocal.cocktail);
            toggleFavorites();
        }
    }
})

// Close Modal when its open
document.querySelector('.modal__close').addEventListener('click', function() {
    modal.classList.remove('active');
})


// Init
showFavoritesFromLs();
toggleFavorites();
