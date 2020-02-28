const bcrypt = require("bcrypt");
const graphql = require("graphql");
const repositories = require("../repositories");
const types = require("./types");

const {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = graphql;
const { tweetRepository, userRepository } = repositories;
const { TweetType, UserType } = types;

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    userById: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(_, args) {
        return userRepository.findById(args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  fields: {
    registerUser: {
      type: UserType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        nickname: {
          type: new GraphQLNonNull(GraphQLString)
        },
        email: {
          type: new GraphQLNonNull(GraphQLString)
        },
        password: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(_, args, { res }) {
        const hashedPassword = bcrypt.hashSync(args.password, 10);
        return userRepository.save(
          args.name,
          args.nickname,
          args.email,
          hashedPassword
        );
      }
    },
    storeTweet: {
      type: TweetType,
      args: {
        text: {
          type: new GraphQLNonNull(GraphQLString)
        },
        userId: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(_, args) {
        return tweetRepository.save(args.text, args.userId);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
