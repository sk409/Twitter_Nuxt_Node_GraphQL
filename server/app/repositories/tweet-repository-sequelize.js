const models = require("../sequelize/models");
const RepositorySequelize = require("./repository-sequelize");

class TweetRepositorySequelize extends RepositorySequelize {
  constructor() {
    super(models.Tweet);
  }
}

module.exports = new TweetRepositorySequelize();
