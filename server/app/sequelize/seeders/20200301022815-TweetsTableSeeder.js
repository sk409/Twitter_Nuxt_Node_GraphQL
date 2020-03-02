"use strict";

const repositories = require("../../repositories");
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [];
    let amount = 1000;
    while (amount--) {
      const now = new Date();
      data.push({
        text: faker.lorem.sentence(),
        userId: 1,
        createdAt: now,
        updatedAt: now
      });
    }
    return queryInterface.bulkInsert("Tweets", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tweets", null, {});
  }
};
