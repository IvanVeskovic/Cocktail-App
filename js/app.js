const favorites = document.querySelector('.favorites');
const form = document.querySelector('#form');
const randomCocktail = document.querySelector('#random-cocktail');
const sectionBottom = document.querySelector('.section__bottom');
const modal = document.querySelector('.modal');


// Comunications with server for random cocktail
const getRandomCocktail = async () => {
    const response = await fetch ('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const data = await response.json();
    addToUi(data.drinks[0]) 
}

// Comunications with server for cocktail by name
const searchByName = async (name) => {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
    const data = await response.json();
    return data.drinks;
}


function addToUi(data){
    const cocktailBox = document.createElement('div');
    cocktailBox.classList.add('cocktail-box');
    cocktailBox.innerHTML = `
        <span class="cocktail-name">${data.strDrink}</span>
        <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="cocktail-img">
        <span class="cocktail-heart">&#10084</span>
    `
    sectionBottom.appendChild(cocktailBox);
    console.log(data);
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
}

// Remove all cocktails
const removeAllCocktails = () => {
    while(sectionBottom.hasChildNodes()){
        sectionBottom.removeChild(sectionBottom.firstChild);
    }
}

// LISTENERS
randomCocktail.addEventListener('click', function(){
    removeAllCocktails()
    getRandomCocktail();
});

sectionBottom.addEventListener('click', function(e){
    const target = e.target;
    
    if(target.classList.contains('cocktail-name')){
        let name = target.innerText;
        searchByName(name)
            .then(data => fillModalWithData(data))
            .catch(err => console.log(err));

        modal.classList.add('active')
    } else if (target.classList.contains('cocktail-heart')) {
        const parentEl = target.parentElement;
        const img = parentEl.querySelector('.cocktail-img').src;
        const name = parentEl.querySelector('.cocktail-name').innerText;
        console.log(img, name);
        createFavorites(img, name);
    }
})

document.querySelector('.modal__close').addEventListener('click', function() {
    modal.classList.remove('active');
})

// document.querySelector('.favorites__delete').addEventListener('click', function(e){
//     e.target.parentElement.remove();
// })

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

const fillModalWithData = (data) => {
    const objData = data[0];
    modal.querySelector('.heading-second').innerText = data[0].strDrink;
    modal.querySelector('.modal__img').src = data[0].strDrinkThumb;
    modal.querySelector('.how-to').innerText = data[0].strInstructions;

    // TRY

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

// Init
getRandomCocktail();


searchByName('Sex')
    .then(data => console.log(data))
    .catch(err => console.log(err));