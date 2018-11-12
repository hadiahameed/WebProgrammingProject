const mongoCollections = require("../config/mongoCollections");
const uuid = require("node-uuid");
const books = mongoCollections.books;

const exportedMethods = {
  async getAllBooks() {
		const booksCollection = await books();
		return await booksCollection.find({}).toArray();
	},
	async getBookById(id) {
		const booksCollection = await books();
		const book = await booksCollection.findOne({ _id: id });

		if (!book) throw "Book not found!";
		return book;
	},
	async addBook(title, author, image, rating, tags) {
		if (!title) throw "Title missing."
		if (typeof title !== "string") throw "Title is not a string";
		if (!author) throw "Author missing."
		if (typeof author !== "string") throw "Author name is not a string";
        if (!image) image = null;
        if (!rating) rating = null;
        if (!tags) tages = null;


		const booksCollection = await books();

		const newBook = {
			title: title,
			author: author,
			steps: steps,
			_id: uuid.v4()
		};

		const newInsertedInfo = await booksCollection.insertOne(newBook);
		const newId = newInsertedInfo.insertedId;
		return await this.getBookById(newId);
	},
	async removeBook(id) {
		const booksCollection = await books();
		const deletionInfo = await booksCollection.removeOne({ _id: id });
		if (deletionInfo.deletedCount === 0) {
			throw `Could not delete book with id: ${id}`;
		}
	},
	async replaceBook(id, replacingBook) {
		const booksCollection = await books();

		let updateCommand = {
			$set: replacingBook
		};
		const query = {
			_id: id
		};
		await booksCollection.updateOne(query,updateCommand);

		return await this.getBookById(id);
	},
	async updateBook(id,updatedBook){
		const booksCollection = await books();

		updatedBookData = {};
		if (!updatedBook.title&&!updatedBook.author&&!updatedBook.steps) throw 'No data provided.'
		if (updatedBook.title) {
			if (typeof updatedBook.title !== "string") throw "Title is not a string";
			updatedBookData.title = updatedBook.title;

		}
		if (updatedBook.author) {
			if (!Array.isArray(updatedBook.author)) throw "Author list is not an array.";
			updatedBookData.author = updatedBook.author;
		}
		if (updatedBook.steps) {
			if (!Array.isArray(updatedBook.steps)) throw "Steps are not passed as an array.";
			updatedBookData.steps = updatedBook.steps;
		}

		let updateCommand = {
			$set: updatedBookData
		};
		const query = {
			_id: id
		};
		await booksCollection.updateOne(query,updateCommand);

		return await this.getBookById(id);
	}
};

module.exports = exportedMethods;