const { gql } = require('apollo-server-express');


module.exports = gql`
	scalar Date

	type Friend {
		id: ID
		name: String!
		alias: String
		email: String!
		phone: String!
		dob: String
		user: User!
	}

	type User {
		id: ID!
		username: String!
		email: String!
		password: String
		friends: [Friend!]
	}

	type Query {
		friends: [Friend!]!
		friend(id: ID): Friend!
	}

	type Mutation {
		signUp(username: String, email: String, password: String): Boolean!
		signIn(email: String, password: String): String!

		addFriend(name: String!, alias: String, email: String!, phone: String, dob: String): Friend!
	}

`