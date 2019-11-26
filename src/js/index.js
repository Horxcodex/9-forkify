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
