"use strict";

const faker = require("faker");

const repositories = require("../../repositories");

const { tweetRepository, userRepository } = repositories;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const index = (min, max) => {
    //   return Math.floor(Math.random() * (max - min)) + min;
    // };
    const tweets = await tweetRepository.findAll();
    const users = await userRepository.findAll();
    const data = [];
    // let amount = 1000;
    let index = 0;
    while (index < users.length) {
      const now = new Date();
      data.push({
        tweetId: 2996,
        userId: users[index].id,
        createdAt: now,
        updatedAt: now
      });
      ++index;
    }
    return queryInterface.bulkInsert("Favorites", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Favorites", null, {});
  }
};
