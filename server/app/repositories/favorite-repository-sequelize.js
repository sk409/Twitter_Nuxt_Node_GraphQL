const models = require("../sequelize/models");
const RepositorySequelize = require("./repository-sequelize");

class FavoriteRepositorySequelize extends RepositorySequelize {
  constructor() {
    super(models.Favorite);
  }
}

module.exports = new FavoriteRepositorySequelize();
