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

const createButton = (page, type) => {
	return `
		<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
			<svg class="search__icon">
				<use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
			</svg>
			<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
		</button>
	`;
};

// render the buttons according the page that we're on
const renderButtons = (page, numResults, resPerPage) => {
	const pages = Math.ceil(numResults / resPerPage);

	let button;
	if (page === 1 && pages > 1) {
		// Only button to go to next page
		button = createButton(page, 'next');
	} else if (page < pages) {
		//Both buttons
		button = `
			${createButton(page, 'prev')};
			${createButton(page, 'next')};
		`;
	} else if (page === pages && pages > 1) {
		// Only button to go to prev page
		button = createButton(page, 'prev');
	}

	elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// Show to UI
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	// render results of current page
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;

	recipes.slice(start, end).forEach(renderRecipe);

	// render pagination buttons
	renderButtons(page, recipes.length, resPerPage);
};
