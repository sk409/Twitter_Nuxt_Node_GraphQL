const graphql = require("graphql");
const { Op } = require("sequelize");

const repositories = require("../repositories");

const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} = graphql;
const { favoriteRepository, userRepository, tweetRepository } = repositories;

const FavoriteType = new GraphQLObjectType({
  name: "Favorite",
  fields: () => ({
    tweetId: {
      type: GraphQLID
    },
    userId: {
      type: GraphQLID
    },
    tweet: {
      type: TweetType,
      resolve(parent) {
        const option = {
          where: { id: parent.tweetId }
        };
        return tweetRepository.findOne(option);
      }
    },
    user: {
      type: UserType,
      resolve(parent) {
        const option = {
          where: { id: parent.userId }
        };
        return userRepository.findOne(option);
      }
    }
  })
});

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
        const option = {
          where: { id: parent.userId }
        };
        return userRepository.findOne(option);
      }
    },
    favorites: {
      type: new GraphQLList(FavoriteType),
      resolve(parent, _) {
        const option = {
          where: { tweetId: parent.id }
        };
        return favoriteRepository.findAll(option);
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
    profileImagePath: {
      type: GraphQLString
    },
    tweets: {
      type: new GraphQLList(TweetType),
      resolve(parent, _) {
        return tweetRepository.findAll(parent.id);
      }
    },
    subscription: {
      type: new GraphQLList(TweetType),
      args: {
        oldBefore: {
          type: GraphQLID
        },
        limit: {
          type: GraphQLInt
        }
      },
      async resolve(parent, args) {
        const condition = {
          userId: parent.id
        };
        if (args.oldBefore && 0 < args.oldBefore) {
          const baselineTweet = await tweetRepository.findOne({
            where: { id: args.oldBefore }
          });
          if (baselineTweet.userId !== parent.id) {
            return;
          }
          condition.id = { [Op.lt]: baselineTweet.id };
        }
        const tweets = await tweetRepository.findAll({
          where: condition,
          limit: args.limit,
          order: [["id", "desc"]]
        });
        return tweets;
      }
    }
  })
});

module.exports = {
  FavoriteType,
  TweetType,
  UserType
};
