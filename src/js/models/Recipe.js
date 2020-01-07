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
		const units = [...unitsShort, 'kg', 'g'];

		const newIngredients = this.ingredients.map((el) => {
			// 1). uniform the units
			let ingredient = el.toLowerCase();
			unitsLong.forEach((cur, i) => {
				ingredient = ingredient.replace(cur, unitsShort[i]);
			});

			// 2). remove the parenthesis "()"
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			// 3). parse ingredients into count, unit and ingredient
			const arrIng = ingredient.split(' ');
			const unitIndex = arrIng.findIndex((cur) => {
				return units.includes(cur);
			});

			let objIng;
			if (unitIndex > -1) {
				// there is a unit
				// Ex. 4 cups, the arrCount is [4] ; case 1 (there's only 1 number) case 1
				// Ex. 4 1/2 cups, the arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5 ; case 2 (there are 2 number) case 2
				const arrCount = arrIng.slice(0, unitIndex);
				let count;
				if (arrCount.length === 1) {
					count = eval(arrIng[0].replace('-', '+')); //case 1
				} else {
					count = eval(arrIng.slice(0, unitIndex).join('+')); //case 2
				}

				objIng = {
					count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(' ')
				};
			} else if (parseInt(arrIng[0], 10)) {
				// there is no unit, But there is a number (On 1st element is number)
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: '',
					ingredient: arrIng.slice(1).join(' ')
				};
			} else if (unitIndex === -1) {
				// there is no unit and there is no number (On 1st element is not number)
				objIng = {
					count: 1,
					unit: '',
					ingredient // it's the same like ingredient: ingredient
				};
			}
			return objIng;
			//return ingredient;
		});
		this.ingredients = newIngredients;
	}
}

// create two arrays & in one array we will have the units as they appear in our ingredients,
// and in the second array, we will have them written exactly like we want them to be

// "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled".replace()
// "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled".replace()
// .replace(/ *\([^)]*\) */g, "")

//(params) => {};
/* FINAL
let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;

*/

// // 1) Uniform units
// let ingredient = el.toLowerCase();
// unitsLong.forEach((unit, i) => {
// 	ingredient = ingredient.replace(unit, unitsShort[i]);
// });

// // 2) Remove parentheses
// ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

// // 3) Parse ingredients into count, unit and ingredient
// const arrIng = ingredient.split(' ');
// const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
