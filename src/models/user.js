// Import mongoose library
const mongoose = require("mongoose");

// create a User schema
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			index: { unique: true },
		},
		email: {
			type: String,
			required: true,
			index: { unique: true },
		},
		password: {
			type: String,
			required: true,
		},
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Friend'
			}
		]
	},
	{
		// Assigns createdAt and updatedAt fields with a Date type
		timestamps: true,
	}
);

// create the user model
const User = mongoose.model('User', userSchema);
// export User
module.exports = User;
