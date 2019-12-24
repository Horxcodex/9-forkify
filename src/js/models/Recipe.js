import axios from 'axios';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
			//console.log(res);
			//console.log(this.result);
		} catch (error) {
			console.log(error);
			alert('Something went wrong :(');
		}
	}

	calcTime() {
		const numIng = this.ingredients.length;
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}

	calcServings() {
		this.servings = 4;
	}

	parseIngredients() {
		const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
		const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

		const newIngredients = this.ingredients.map((el) => {
			// 1). uniform units
			let ingredient = el.toLowerCase();
			unitsLong.forEach((cur, i) => {
				ingredient = ingredient.replace(cur, unitsShort[i]);
			});

			// 2). remove the parenthesis "()""
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			// 3). parse ingredients into count, unit and ingredient
			return ingredient;
		});

		this.ingredients = newIngredients;
	}
}

// create two arrays & in one array we will have the units as they appear in our ingredients,
// and in the second array, we will have them written exactly like we want them to be

// "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled".replace()
// "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled".replace()
// .replace(/ *\([^)]*\) */g, "")
