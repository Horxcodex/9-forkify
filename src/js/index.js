import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/* *Global state of the app
- Search Object
- Current recipe Object
- Shopping list object
- liked recipe
*/

const state = {};

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

		// 4. Search for recipe
		await state.search.getResults();

		// 5. Render or show results on UI
		clearLoader();
		searchView.renderResults(state.search.result);
		console.log(state.search.result);
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
