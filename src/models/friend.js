// Import the mongoose library
const mongoose = require('mongoose');

// define a mongoose schema
const friendSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		alias: {
			type: String
		},
		email: {
			type: String,
			required: true
		},
		phone: {
			type: String,
			required: true
		},
		dob: {
			type: Date,
			required: true
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{
		 // Assigns createdAt and updatedAt fields with a Date type
		timestamps: true
	}
);

const Friend = mongoose.model('Friend', friendSchema);
// export Friend model
module.exports = Friend;