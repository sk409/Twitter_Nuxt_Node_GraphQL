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

const tweetBatchGetterByUserId = async keys => {
  let orderDirection = "desc";
  const where = {
    userId: {
      $in: keys.map(key => key.userId)
    }
  };
  if (keys[0].newAfter && 0 <= keys[0].newAfter) {
    orderDirection = "asc";
    where.id = {
      $gt: keys[0].newAfter
    };
  }
  if (keys[0].oldBefore && 0 <= keys[0].oldBefore) {
    where.id = {
      $lt: keys[0].oldBefore
    };
  }
  const option = {
    where,
    order: [["id", orderDirection]],
    limit: keys[0].limit
  };
  const tweets = await tweetRepository.findAll(option);
  const tweetGroups = _.groupBy(tweets, "userId");
  return new Promise(resolve => {
    resolve(keys.map(key => tweetGroups[key.userId] || []));
  });
};

module.exports = {
  tweetBatchGetterById,
  tweetBatchGetterByParentId,
  tweetBatchGetterByUserId
};
