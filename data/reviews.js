const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;

const exportedMethods = {
  async getAllReviews() {
		const reviewsCollection = await reviews();
		return await reviewsCollection.find({}).toArray();
	},
	async getReviewsByBookId(BookId) {
		const reviewsCollection = await reviews();
		const review = await reviewsCollection.find({ BookId: BookId });
		return review;
	}
};

module.exports = exportedMethods;