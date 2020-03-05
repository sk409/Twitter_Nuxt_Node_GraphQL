const _ = require("lodash");

const repositories = require("../../../repositories");

const { userRepository } = repositories;

const userBatchGetterById = async ids => {
  const option = {
    where: {
      id: {
        $in: ids
      }
    }
  };
  const users = await userRepository.findAll(option);
  const userGroups = _.groupBy(users, "id");
  return new Promise(resolve => {
    resolve(ids.map(id => userGroups[id][0] || []));
  });
};

module.exports = {
  userBatchGetterById
};
