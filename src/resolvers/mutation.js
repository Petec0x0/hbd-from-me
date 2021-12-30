const mongoose = require('mongoose');
// import bcryptjs for password hashing
const bcrypt = require('bcryptjs');
// and jwt for auth
const jwt = require('jsonwebtoken');
const {
	AuthenticationError,
	ForbiddenError
} = require('apollo-server-express');

module.exports = {
	// signUp functionality resolver
	signUp: async (parent, { username, email, password }, { models }) => {
		// get the sent resquest param value
		const hashedPassword = await bcrypt.hash(password, 10);
		// normalize email address to lowercase
		email = email.trim().toLowerCase();

		try{
			// create a user object
			const user = await models.User.create({
				username,
				email,
				password: hashedPassword
			});

			return true;
		}catch(err){
			console.log(err);
			throw new Error(`${err}`);
		}
	}, 

	// signIn functionality resolver 
	signIn: async (parent, { email, password }, { models }) => {
		try{
			// normalize email address to lowercase
			email = email.trim().toLowerCase();

			// find user
			const user =  await models.User.findOne({email: email});
			// check if user exists
			if(!user){
				throw new AuthenticationError('Authentication error: invalid username/password');
			}

			// check if user password is correct
			const matched = await bcrypt.compare(password, user.password);
			if(!matched){
				throw new AuthenticationError('Authentication error: invalid username/password');
			}
			// return JWT
			const token = jwt.sign({username:user.username}, process.env.SECRET_KEY);
			return token;
		}catch(err){
			console.log(err);
		}
	},

	// Add new friend resolver
	addFriend: async (parent, { name, alias, email, phone, dob }, { models, user }) => {
		try{
			// verify if the authenticated user is a valid user
			let auth_user = await models.User.findOne({username: user.username});
			if(!auth_user){
				throw new ForbiddenError('Invalid Session');
			}
			// normalize email address to lowercase
			email = email.trim().toLowerCase();
			// create new Friend object
			const friend = models.Friend.create({
				name,
				alias,
				email,
				phone,
				dob: Date.parse(dob),
				user: auth_user._id
			});
			// add friend to current user's friends list
			auth_user = await models.User.findOneAndUpdate(
				{
					username: user.username
				}, 
				{
					$push: {
						friends: mongoose.Types.ObjectId(friend.id)
					}
				}
			);

			return friend;
		}catch(err){
			console.log(err);
		}
	}

};