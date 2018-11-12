const mongoCollections = require("../config/mongoCollections");
const uuid = require("node-uuid");
const books = mongoCollections.books;

const exportedMethods = {
  async getAllBooks() {
		const booksCollection = await books();
		return await booksCollection.find({}).toArray();
	},
	async getRecipeById(id) {
		const booksCollection = await books();
		const book = await booksCollection.findOne({ _id: id });

		if (!book) throw "Recipe not found!";
		return book;
	},
	async addRecipe(title, ingredients, steps) {
		if (!title) throw "Title missing."
		if (typeof title !== "string") throw "Title is not a string";
		if (!ingredients) throw "Ingredients missing."
		if (!Array.isArray(ingredients)) throw "Ingredient list is not an array.";
		if (!steps) throw "Steps missing."
		if (!Array.isArray(steps)) throw "Steps are not passed as an array.";

		const booksCollection = await books();

		const newRecipe = {
			title: title,
			ingredients: ingredients,
			steps: steps,
			_id: uuid.v4()
		};

		const newInsertedInfo = await booksCollection.insertOne(newRecipe);
		const newId = newInsertedInfo.insertedId;
		return await this.getRecipeById(newId);
	},
	async removeRecipe(id) {
		const booksCollection = await books();
		const deletionInfo = await booksCollection.removeOne({ _id: id });
		if (deletionInfo.deletedCount === 0) {
			throw `Could not delete book with id: ${id}`;
		}
	},
	async replaceRecipe(id, replacingRecipe) {
		const booksCollection = await books();

		let updateCommand = {
			$set: replacingRecipe
		};
		const query = {
			_id: id
		};
		await booksCollection.updateOne(query,updateCommand);

		return await this.getRecipeById(id);
	},
	async updateRecipe(id,updatedRecipe){
		const booksCollection = await books();

		updatedRecipeData = {};
		if (!updatedRecipe.title&&!updatedRecipe.ingredients&&!updatedRecipe.steps) throw 'No data provided.'
		if (updatedRecipe.title) {
			if (typeof updatedRecipe.title !== "string") throw "Title is not a string";
			updatedRecipeData.title = updatedRecipe.title;

		}
		if (updatedRecipe.ingredients) {
			if (!Array.isArray(updatedRecipe.ingredients)) throw "Ingredient list is not an array.";
			updatedRecipeData.ingredients = updatedRecipe.ingredients;
		}
		if (updatedRecipe.steps) {
			if (!Array.isArray(updatedRecipe.steps)) throw "Steps are not passed as an array.";
			updatedRecipeData.steps = updatedRecipe.steps;
		}

		let updateCommand = {
			$set: updatedRecipeData
		};
		const query = {
			_id: id
		};
		await booksCollection.updateOne(query,updateCommand);

		return await this.getRecipeById(id);
	}
};

module.exports = exportedMethods;