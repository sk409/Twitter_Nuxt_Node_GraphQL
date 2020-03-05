const conversationBatchGetters = require("./conversation-batch-getters");
const favoriteBatchGetters = require("./favorite-batch-getters");
const subscriptionBatchGetters = require("./subscription-batch-getters");
const tweetBatchGetters = require("./tweet-batch-getters");
const userBatchGetters = require("./user-batch-getters");

const batchGetters = {
  ...conversationBatchGetters,
  ...favoriteBatchGetters,
  ...subscriptionBatchGetters,
  ...tweetBatchGetters,
  ...userBatchGetters
};

module.exports = batchGetters;
