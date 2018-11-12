const bookRoutes = require("./books");
const reviewRoutes = require("./reviews");
const userRoutes = require("./users");

const constructorMethod = app => {
    app.use("/books", bookRoutes);
    app.use("/reviews", reviewRoutes);
    app.use("/users", userRoutes);

	app.use("*", (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;