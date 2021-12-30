const express = require("express");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();
// import the db connection
const db = require("./db");
// import the created mongodb models
const models = require('./models');
// import the graphql schema/typeDefs
const typeDefs = require("./schema");
// import the created resolvers
const resolvers = require("./resolvers");
// import jsonwebtoken
const jwt = require('jsonwebtoken');

const app = express();
// check for the specified port in the .env file
const port = process.env.PORT || 5000;
// get the db url from .env file
const DB_HOST = process.env.DB_HOST;
// connect to db
db.connect(DB_HOST);

// a function for getting a user from a jwt token
const getUser = (token) => {
	try{
		const username = jwt.verify(token, process.env.SECRET_KEY);
		return username;
	}catch(err){
		//throw new Error('Session invalid');
		return false;
	}
}

const startApolloServer = async () => {
	// start apollo server
	const server = new ApolloServer(
		{ 
			typeDefs,
			resolvers,
			context: ({ req }) => {
				// get the authorization header value and verify the token
				const token = req.headers.authorization;
				// call the defined getUser function
				const user = getUser(token);
				return { models, user };
			} 
		}
	);

	// added this line
	await server.start();

	// Apply the Apollo GraphQL middleware and set the path to /api
	server.applyMiddleware({ app, path: "/graphql"});

	app.listen({ port }, () => {
		console.log(
			`GraphQL server connected to @ port http://localhost:${port}${server.graphqlPath}`
		);
	});
};

startApolloServer()

