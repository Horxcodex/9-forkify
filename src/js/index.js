import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/* *Global state of the app
- Search Object
- Current recipe Object
- Shopping list object
- liked recipe
*/

const state = {};

// --------------------------SEARCH CONTROLLER---------------------------------

const controlSearch = async () => {
	// 1. Get query from view
	const query = searchView.getInput(); //TODO
	//console.log(query);

	if (query) {
		// 2. Create New search object and add to state
		state.search = new Search(query);
		//console.log(state);

		// 3. Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try {
			// 4. Search for recipe
			await state.search.getResults();

			// 5. Render or show results on UI
			clearLoader();
			searchView.renderResults(state.search.result);
			console.log(state.search.result);
		} catch (err) {
			alert('Error Proccesing the Search!');
			clearLoader();
		}
	}
};

elements.searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	controlSearch();
});

// add event listener to pages Note: Event Delegation

elements.searchResPages.addEventListener('click', (e) => {
	// 1. Choose the button that we want to click
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		// 2. Declare the goToPage with choosing the button, and convrt it to int.
		const goToPage = parseInt(btn.dataset.goto, 10);

		// 3. Clear the result and the button before next render shows up the results.
		searchView.clearResults();

		// 4. Render the result again. Becuz we want to show the reult to UI again. note : goToPage = page in renderResults function
		searchView.renderResults(state.search.result, goToPage);
		//console.log(goToPage);
	}
});

// --------------------------RECIPE CONTROLLER---------------------------------
/* const r = new Recipe(47746);
//console.log(r);
r.getRecipe();
console.log(r); */

const controlRecipe = async () => {
	// 1. Get id from the URL
	const id = window.location.hash.replace('#', '');
	console.log(id);

	if (id) {
		// 2. Prepare UI for changes

		// 3. Create new recipe object
		state.recipe = new Recipe(id);

		window.r = state.recipe;

		try {
			// 4. Get recipe data
			await state.recipe.getRecipe();

			// 5. Calculte servings and time by calling the method
			state.recipe.calcTime();
			state.recipe.calcServings();
			//state.recipe.parseIngredients();

			// 6. Render recipe to UI.
			console.log(state.recipe);
			//console.log(state);
		} catch (err) {
			alert('Error Proccesing Recipe!');
		}
	}
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

//['hashchange', 'load'].forEach((cur) => window.addEventListener(cur, controlRecipe));
