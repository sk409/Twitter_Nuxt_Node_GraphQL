const models = require("../sequelize/models");

const tweetRepositorySequelize = {
  findByUserId(userId) {
    return models.Tweet.findAll({ where: { user_id: userId } });
  },
  save(text, userId) {
    return models.Tweet.build({
      text,
      user_id: userId
    }).save();
  }
};

module.exports = tweetRepositorySequelize;
