const models = require("../sequelize/models");

const userRepositorySequelize = {
  findById(id) {
    return models.User.findByPk(id);
  },
  save(name, nickname, email, password) {
    return models.User.build({
      name,
      nickname,
      email,
      password
    }).save();
  }
};

module.exports = userRepositorySequelize;
