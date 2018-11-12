const mongoCollections = require("../config/mongoCollections");
const uuid = require("node-uuid");
const users = mongoCollections.users;

const exportedMethods = {
  async getAllUsers() {
		const usersCollection = await users();
		return await usersCollection.find({}).toArray();
	},
	async getUserById(id) {
		const usersCollection = await users();
		const user = await usersCollection.findOne({ _id: id });

		if (!user) throw "User not found!";
		return user;
	},
	async addUser(name, password) {
		if (!name) throw "Name missing."
		if (typeof name !== "string") throw "Name is not a string";
		if (!password) throw "Password missing."
		if (typeof passowrd !== "string") throw "Password is not a string";
		
		const usersCollection = await users();

		const newUser = {
            name: name,
            password, passowrd,
			_id: uuid.v4()
		};

		const newInsertedInfo = await usersCollection.insertOne(newUser);
		const newId = newInsertedInfo.insertedId;
		return await this.getUserById(newId);
	},
	async removeUser(id) {
		const usersCollection = await users();
		const deletionInfo = await usersCollection.removeOne({ _id: id });
		if (deletionInfo.deletedCount === 0) {
			throw `Could not delete user with id: ${id}`;
		}
	},
	async updateUser(id,updatedUser){
		const usersCollection = await users();

		updatedUserData = {};
		if (!updatedUser.name&&!updatedUser.password) throw 'No data provided.'
		if (updatedUser.name) {
			if (typeof updatedUser.name !== "string") throw "Name is not a string";
			updatedUserData.name = updatedUser.name;
		}
        if (updatedUser.password) {
			if (typeof updatedUser.password !== "string") throw "Password is not a string";
			updatedUserData.password = updatedUser.password;
		}

		let updateCommand = {
			$set: updatedUserData
		};
		const query = {
			_id: id
		};
		await usersCollection.updateOne(query,updateCommand);

		return await this.getUserById(id);
	}
};

module.exports = exportedMethods;