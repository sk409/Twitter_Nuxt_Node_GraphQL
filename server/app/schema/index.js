const graphql = require("graphql");

const favoriteQueries = require("./favorite-queries");
const tweetQueries = require("./tweet-queries");
const userQueries = require("./user-queries");

const { GraphQLObjectType, GraphQLSchema } = graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...favoriteQueries.query,
    ...tweetQueries.query,
    ...userQueries.query
  }
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  fields: {
    ...favoriteQueries.mutation,
    ...tweetQueries.mutation,
    ...userQueries.mutation
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
