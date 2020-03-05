const _ = require("lodash");
const repositories = require("../../../repositories");

const { tweetRepository } = repositories;

const subscriptionBatchGetter = async keys => {
  let limit = keys[0].limit;
  let orderDirection = "desc";
  const conditions = [];
  for (const key of keys) {
    const condition = {
      userId: key.userId,
      parentId: null
    };
    if (key.oldBefore && 0 < key.oldBefore) {
      const baselineTweet = await tweetRepository.findOne({
        where: {
          id: key.oldBefore
        }
      });
      condition.id = {
        $lt: baselineTweet.id
      };
    } else if (key.newAfter && 0 < key.newAfter) {
      const baselineTweet = await tweetRepository.findOne({
        where: {
          id: key.newAfter
        }
      });
      condition.id = {
        $gt: baselineTweet.id
      };
      orderDirection = "asc";
    }
    conditions.push(condition);
  }
  const tweets = await tweetRepository.findAll({
    where: { $or: conditions },
    limit: limit,
    order: [["id", orderDirection]]
  });
  const tweetGroups = _.groupBy(tweets, "userId");
  return new Promise(resolve => {
    resolve(keys.map(key => tweetGroups[key.userId] || []));
  });
};

module.exports = {
  subscriptionBatchGetter
};
