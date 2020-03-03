const bcrypt = require("bcrypt");
const graphql = require("graphql");

const constants = require("../assets/js/constants");
const repositories = require("../repositories");
const types = require("./types");

const { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } = graphql;

const { noImagePath } = constants;
const { userRepository } = repositories;
const { UserType } = types;

const bcryptRounds = 10;

const userQueries = {
  query: {
    currentUser: {
      type: UserType,
      resolve(_, args, { req }) {
        if (!req.session.userId) {
          return null;
        }
        const option = {
          where: { id: req.session.userId }
        };
        return userRepository.findOne(option);
      }
    },
    user: {
      type: UserType,
      args: {
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
        }
      },
      resolve(_, args) {
        const option = {
          where: args
        };
        return userRepository.findOne(option);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      args: {
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
        }
      },
      resolve(_, args) {
        const option = {
          where: args
        };
        return userRepository.findAll(option);
      }
    }
  },
  mutation: {
    login: {
      type: UserType,
      args: {
        email: {
          type: new GraphQLNonNull(GraphQLString)
        },
        password: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(_, args, { req }) {
        const option = {
          where: { email: args.email }
        };
        const user = await userRepository.findOne(option);
        if (!user || !bcrypt.compareSync(args.password, user.password)) {
          return null;
        }
        req.session.userId = user.id;
        return user;
      }
    },
    register: {
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
      async resolve(_, args, { req }) {
        const hashedPassword = bcrypt.hashSync(args.password, bcryptRounds);
        const data = Object.assign({}, args);
        data.password = hashedPassword;
        data.profileImagePath = noImagePath;
        const user = await userRepository.save(data);
        req.session.userId = user.id;
        return user;
      }
    }
  }
};

module.exports = userQueries;
