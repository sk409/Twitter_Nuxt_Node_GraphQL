const graphql = require("graphql");

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
      resolve(parent) {
        const option = {
          where: { id: parent.userId }
        };
        return userRepository.findOne(option);
      }
    },
    parent: {
      type: TweetType,
      resolve(parent) {
        if (!parent.parentId) {
          return null;
        }
        const option = {
          where: { id: parent.parentId }
        };
        return tweetRepository.findOne(option);
      }
    },
    favorites: {
      type: new GraphQLList(FavoriteType),
      resolve(parent) {
        const option = {
          where: { tweetId: parent.id }
        };
        return favoriteRepository.findAll(option);
      }
    },
    replies: {
      type: new GraphQLList(TweetType),
      resolve(parent) {
        const option = {
          where: { parentId: parent.id }
        };
        return tweetRepository.findAll(option);
      }
    },
    conversation: {
      type: new GraphQLList(TweetType),
      args: {
        depth: {
          type: GraphQLInt
        },
        userId: {
          type: GraphQLID
        }
      },
      async resolve(parent, args) {
        const reply = await tweetRepository.findOne({
          where: { parentId: parent.id },
          order: [["id", "desc"]]
        });
        if (!reply) {
          return [];
        }
        //
        // if (args.userId) {
        //   replies = replies.fliter(reply => {
        //     return reply.userId === args.userId;
        //   });
        // }
        //
        const depth = args.depth ? args.depth : Number.MAX_SAFE_INTEGER;
        const conversation = [reply];
        while (conversation.length < depth) {
          const child = await tweetRepository.findOne({
            where: {
              // userId: { $or: [parent.userId, reply.userId] },
              parentId: conversation[conversation.length - 1].id
            },
            limit: 1
          });
          if (!child) {
            break;
          }
          conversation.push(child);
        }
        return conversation;
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
        newAfter: {
          type: GraphQLID
        },
        oldBefore: {
          type: GraphQLID
        },
        limit: {
          type: GraphQLInt
        }
      },
      async resolve(parent, args) {
        const condition = {
          userId: parent.id,
          parentId: null
        };
        let orderDirection = "desc";
        if (args.oldBefore && 0 < args.oldBefore) {
          const baselineTweet = await tweetRepository.findOne({
            where: { id: args.oldBefore }
          });
          if (baselineTweet.userId !== parent.id) {
            return;
          }
          condition.id = { $lt: baselineTweet.id };
        } else if (args.newAfter && 0 < args.newAfter) {
          const baselineTweet = await tweetRepository.findOne({
            where: { id: args.newAfter }
          });
          if (baselineTweet.userId !== parent.id) {
            return;
          }
          condition.id = { $gt: baselineTweet.id };
          orderDirection = "asc";
        }
        const tweets = await tweetRepository.findAll({
          where: condition,
          limit: args.limit,
          order: [["id", orderDirection]]
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
