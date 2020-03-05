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
      resolve(parent, _, { tweetLoaderById }) {
        return tweetLoaderById.load(parent.tweetId);
      }
    },
    user: {
      type: UserType,
      resolve(parent, _, { userLoaderById }) {
        return userLoaderById.load(parent.userId);
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
      resolve(parent, _, { userLoaderById }) {
        return userLoaderById.load(parent.userId);
      }
    },
    parent: {
      type: TweetType,
      resolve(parent, _, { tweetLoaderById }) {
        if (!parent.parentId) {
          return null;
        }
        return tweetLoaderById.load(parent.parentId);
      }
    },
    favorites: {
      type: new GraphQLList(FavoriteType),
      resolve(parent, _, { favoriteLoaderByTweetId }) {
        return favoriteLoaderByTweetId.load(parent.id);
      }
    },
    replies: {
      type: new GraphQLList(TweetType),
      resolve(parent, _, { tweetLoaderByParentId }) {
        return tweetLoaderByParentId.load(parent.id);
      }
    },
    conversation: {
      type: new GraphQLList(new GraphQLList(TweetType)),
      args: {
        depth: {
          type: GraphQLInt
        },
        limit: {
          type: GraphQLInt
        },
        userId: {
          type: GraphQLID
        }
      },
      async resolve(parent, args, { conversationLoader }) {
        const key = {
          ...args,
          parentId: parent.id
        };
        return conversationLoader.load(key);
      }
    },
    conversationLength: {
      type: new GraphQLList(GraphQLInt),
      args: {
        limit: {
          type: GraphQLInt
        },
        userId: {
          type: GraphQLID
        }
      },
      async resolve(parent, args, { conversationLengthLoader }) {
        const key = {
          ...args,
          parentId: parent.id
        };
        return conversationLengthLoader.load(key);
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
      resolve(parent, _, { tweetLoaderByUserId }) {
        return tweetLoaderByUserId.load(parent.id);
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
      resolve(parent, args, { subscriptionBatchLoader }) {
        const key = {
          ...args,
          userId: parent.id
        };
        return subscriptionBatchLoader.load(key);
      }
    }
  })
});

module.exports = {
  FavoriteType,
  TweetType,
  UserType
};
