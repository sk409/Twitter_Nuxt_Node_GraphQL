"use strict";

const faker = require("faker");

const repositories = require("../../repositories");

const { tweetRepository, userRepository } = repositories;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const index = (min, max) => {
      return Math.floor(Math.random() * (max - min)) + min;
    };
    const tweets = await tweetRepository.findAll();
    const users = await userRepository.findAll();
    const data = [];
    let amount = 50;
    while (amount--) {
      const now = new Date();
      data.push({
        tweetId: tweets[index(0, tweets.length)].id,
        userId: users[index(0, users.length)].id,
        createdAt: now,
        updatedAt: now
      });
    }
    return queryInterface.bulkInsert("Favorites", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Favorites", null, {});
  }
};
