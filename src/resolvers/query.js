const { ForbiddenError } = require('apollo-server-express');

module.exports = {
	friends: async (parent, args, { models, user }) => {
		// check if authenticated user is making the request
		let auth_user = await models.User.findOne({ username: user.username });
		if (!auth_user) {
			throw new ForbiddenError("Invalid Session");
		}
		const friends = await models.Friend.find({ user: auth_user.id });

		return friends;
	},
};
