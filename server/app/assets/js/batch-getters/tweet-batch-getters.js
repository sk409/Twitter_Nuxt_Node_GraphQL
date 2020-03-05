const _ = require("lodash");

const repositories = require("../../../repositories");

const { tweetRepository } = repositories;

const tweetBatchGetterById = async ids => {
  const option = {
    where: {
      id: {
        $in: ids
      }
    }
  };
  const tweets = await tweetRepository.findAll(option);
  const tweetGroups = _.groupBy(tweets, "id");
  return new Promise(resolve => {
    resolve(ids.map(id => tweetGroups[id][0] || []));
  });
};

const tweetBatchGetterByParentId = async parentIds => {
  const option = {
    where: {
      parentId: {
        $in: parentIds
      }
    }
  };
  const tweets = await tweetRepository.findAll(option);
  const tweetGroups = _.groupBy(tweets, "parentId");
  return new Promise(resolve => {
    resolve(parentIds.map(parentId => tweetGroups[parentId] || []));
  });
};

const tweetBatchGetterByUserId = async userIds => {
  const option = {
    where: {
      userId: {
        $in: userIds
      }
    }
  };
  const tweets = await tweetRepository.findAll(option);
  const tweetGroups = _.groupBy(tweets, "userId");
  return new Promise(resolve => {
    resolve(userIds.map(userId => tweetGroups[userId] || []));
  });
};

module.exports = {
  tweetBatchGetterById,
  tweetBatchGetterByParentId,
  tweetBatchGetterByUserId
};
