"use strict";

const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [];
    let amount = 1000;
    while (amount--) {
      const now = new Date();
      data.push({
        text: faker.lorem.sentence(),
        userId: 101,
        parentId: null,
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
