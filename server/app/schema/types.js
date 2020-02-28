const graphql = require("graphql");
const repositories = require("../repositories");

const { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } = graphql;
const { tweetRepository, userRepository } = repositories;

const TweetType = new GraphQLObjectType({
  name: "Tweet",
  fields: () => ({
    id: {
      type: GraphQLID
    },
    text: {
      type: GraphQLString
    },
    user: {
      type: UserType,
      resolve(parent, _) {
        return userRepository.findById(parent.user_id);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    nickname: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    tweets: {
      type: new GraphQLList(TweetType),
      resolve(parent, _) {
        return tweetRepository.findByUserId(parent.id);
      }
    }
  })
});

const types = {
  TweetType,
  UserType
};

module.exports = types;
