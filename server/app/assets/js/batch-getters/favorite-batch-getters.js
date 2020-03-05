const _ = require("lodash");

const repositories = require("../../../repositories");

const { favoriteRepository } = repositories;

const favoriteBatchGetterByTweetId = async tweetIds => {
  const option = {
    where: {
      tweetId: { $in: tweetIds }
    }
  };
  const favorites = await favoriteRepository.findAll(option);
  const favoriteGroups = _.groupBy(favorites, "tweetId");
  return new Promise(resolve => {
    resolve(tweetIds.map(tweetId => favoriteGroups[tweetId] || []));
  });
};

module.exports = {
  favoriteBatchGetterByTweetId
};
