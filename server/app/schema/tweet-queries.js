const graphql = require("graphql");

const repositories = require("../repositories");
const types = require("./types");

const { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } = graphql;
const { tweetRepository } = repositories;
const { TweetType } = types;

const tweetQueries = {
  query: {
    tweet: {
      type: TweetType,
      args: {
        id: {
          type: GraphQLID
        },
        text: {
          type: GraphQLString
        },
        userId: {
          type: GraphQLID
        }
      },
      resolve(_, args) {
        const option = {
          where: args
        };
        return tweetRepository.findOne(option);
      }
    },
    tweets: {
      type: new GraphQLList(TweetType),
      args: {
        id: {
          type: GraphQLID
        },
        text: {
          type: GraphQLString
        },
        userId: {
          type: GraphQLID
        }
      },
      resolve(_, args) {
        const option = {
          where: args
        };
        return tweetRepository.findAll(option);
      }
    }
  },
  mutation: {
    storeTweet: {
      type: TweetType,
      args: {
        text: {
          type: new GraphQLNonNull(GraphQLString)
        },
        userId: {
          type: new GraphQLNonNull(GraphQLID)
        },
        parentId: {
          type: GraphQLID
        }
      },
      resolve(_, args) {
        return tweetRepository.save(args);
      }
    }
  }
};

module.exports = tweetQueries;
