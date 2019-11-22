import { elements } from './base';

export const getInput = () => {
	return elements.searchInput.value;
};

export const clearInput = () => {
	elements.searchInput.value = '';
};

export const clearResults = () => {
	elements.searchResultList.innerHTML = '';
};

// Limit Title

const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];

	if (title.length > limit) {
		title.split(' ').reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}

			return acc + cur.length;
		}, 0);

		// return the result
		return `${newTitle.join(' ')}...`;
	} else {
		return title;
	}
};

// cara 1 adalah cara paling simple :)
/* const limitRecipeTitle = (title, limit = 17) =>{
    if (title.length > limit){
      let newTitle=  title.split('').splice(0,limit);
 
      // Return New title
      return `${newTitle.join('')}...`;
 
      // Return the title containing less than 17 letters
    } return title;
}; */

//cara 2
/* const limitRecipeTitle2 = (title, limit = 17) => {
	const newTitle = [];

	// acc = 4 -> 9 -> 14 -> 18
	//"Best Pizza Dough Ever" = [best, pizza, dough, ever]
	// newtitle = [best, pizza, dough, ] = best pizza dough ...

	if (title.length > limit) {
		let splitted = title.split(' ');
		console.log(splitted);
		let reduced = splitted.reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}

			return acc + cur.length;
		}, 0);

		// return the result
		return `${newTitle.join(' ')} ...`;
	}

	return title;
}; */

// callback function for the renderResult forEach method
export const renderRecipe = (recipe) => {
	const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src=${recipe.image_url} alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

	// show the markup to UI
	elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// Show to UI
export const renderResults = (recipes) => {
	recipes.forEach(renderRecipe);
};
