import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/* *Global state of the app
- Search Object
- Current recipe Object
- Shopping list object
- liked recipe
*/

const state = {};

// for testing purpses
window.state = state;

// --------------------------SEARCH CONTROLLER---------------------------------

const controlSearch = async () => {
	// 1. Get query from view
	const query = searchView.getInput(); //TODO

	/* // TESTING
	const query = 'pizza'; */
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

/* // TESTING
window.addEventListener('load', (e) => {
	e.preventDefault();
	controlSearch();
}); */

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
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		// highlighted selected search item
		if (state.search) {
			searchView.highlightSelected(id);
		}

		// 3. Create new recipe object
		state.recipe = new Recipe(id);

		/* TESTING
		window.r = state.recipe; */

		try {
			// 4. Get recipe data and parse the inghredients
			await state.recipe.getRecipe();
			//console.log(state.recipe.ingredients);
			state.recipe.parseIngredients();

			// 5. Calculte servings and time by calling the method
			state.recipe.calcTime();
			state.recipe.calcServings();

			// 6. Render recipe to UI.
			clearLoader();
			recipeView.renderRecipe(state.recipe);
			//console.log(state.recipe);
			//console.log(state);
		} catch (err) {
			alert('Error Proccesing Recipe!');
		}
	}
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach((cur) => window.addEventListener(cur, controlRecipe));

// --------------------------LIST CONTROLLER---------------------------------
const controlList = () => {
	// Create a new list IF there is not yet
	if (!state.list) state.list = new List();

	// Add each ingredient to the list and UI
	state.recipe.ingredients.forEach((cur) => {
		const item = state.list.addItem(cur.count, cur.unit, cur.ingredient);
		listView.renderItem(item);
	});

	//console.log(state.list);
};

// handle delete and update list item event.
elements.shopping.addEventListener('click', (e) => {
	const id = e.target.closest('.shopping__item').dataset.itemid;
	console.log(id);

	// Handle The Delete item
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		// delete from state
		state.list.deleteItem(id);

		// delete from UI
		listView.deleteItem(id);

		// Handle The Count Update
	} else if (e.target.matches('.shopping__count-value')) {
		// read the data from the interface, and then update it in our state
		const val = parseFloat(e.target.value, 10);
		state.list.updateCount(id, val);
	}
});

// handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		controlList();
	}

	console.log(state.recipe);
});

window.L = new List();
