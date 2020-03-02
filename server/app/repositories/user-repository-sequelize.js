const models = require("../sequelize/models");
const RepositorySequelize = require("./repository-sequelize");

class UserRepositorySequelize extends RepositorySequelize {
  constructor() {
    super(models.User);
  }
}

module.exports = new UserRepositorySequelize();
