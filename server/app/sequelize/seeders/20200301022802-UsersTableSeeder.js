"use strict";

const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const data = [];
    let amount = 50;
    while (amount--) {
      const now = new Date();
      data.push({
        name: faker.random.uuid(),
        nickname: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        createdAt: now,
        updatedAt: now
      });
    }
    return queryInterface.bulkInsert("Users", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
