const graphql = require("graphql");

const repositories = require("../repositories");
const types = require("./types");

const { GraphQLID, GraphQLList, GraphQLNonNull } = graphql;
const { favoriteRepository } = repositories;
const { FavoriteType } = types;

const favoriteQueries = {
  query: {
    favorite: {
      type: FavoriteType,
      args: {
        tweetId: {
          type: GraphQLID
        },
        userId: {
          type: GraphQLID
        }
      },
      resolve(_, args) {
        const option = { where: args };
        return favoriteRepository.findOne(option);
      }
    },
    favorites: {
      type: new GraphQLList(FavoriteType),
      args: {
        tweetId: {
          type: GraphQLID
        },
        userId: {
          type: GraphQLID
        }
      },
      resolve(_, args) {
        const option = { where: args };
        return favoriteRepository.findAll(option);
      }
    }
  },
  mutation: {
    deleteFavorite: {
      type: FavoriteType,
      args: {
        tweetId: {
          type: new GraphQLNonNull(GraphQLID)
        },
        userId: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(_, args) {
        const option = {
          where: args
        };
        return favoriteRepository.destory(option);
      }
    },
    storeFavorite: {
      type: FavoriteType,
      args: {
        tweetId: {
          type: new GraphQLNonNull(GraphQLID)
        },
        userId: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(_, args) {
        return favoriteRepository.save(args);
      }
    }
  }
};

module.exports = favoriteQueries;
