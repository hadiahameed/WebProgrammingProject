const mongoCollections = require("../config/mongoCollections");
const uuid = require("node-uuid");
const books = mongoCollections.books;
const reviews = mongoCollections.reviews;

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
		const reviews = 
		
		const booksCollection = await books();

		const newBook = {
			title: title,
			author: author,
			image: image,
			rating: rating,
			tags: tags,
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
	async updateBook(id,updatedBook){
		const booksCollection = await books();

		updatedBookData = {};
		if (!updatedBook.title&&!updatedBook.author&&!updatedBook.steps) throw 'No data provided.'
		if (updatedBook.title) {
			//if (typeof updatedBook.title !== "string") throw "Title is not a string";
			updatedBookData.title = updatedBook.title;

		}
		if (updatedBook.author) {
			i//f (typeof updatedBook.author !== "string") throw "Author is not a string.";
			updatedBookData.author = updatedBook.author;
		}
		if (updatedBook.image) {
			updatedBookData.image = updatedBook.image;
		}
		if (updatedBook.tags) {
			updatedBookData.tags = updatedBook.tags;
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