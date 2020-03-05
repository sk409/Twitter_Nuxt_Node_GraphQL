"use strict";

const faker = require("faker");
const repositories = require("../../repositories");

const { tweetRepository, userRepository } = repositories;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const index = (min, max) => {
      return Math.floor(Math.random() * (max - min)) + min;
    };
    const users = await userRepository.findAll();
    const tweets = await tweetRepository.findAll();
    const data = [];
    let amount = 1000;
    while (amount--) {
      const now = new Date();
      data.push({
        text: faker.lorem.sentence(),
        userId: users[index(0, users.length)].id,
        parentId: tweets[index(0, tweets.length)].id,
        createdAt: now,
        updatedAt: now
      });
    }
    return queryInterface.bulkInsert("Tweets", data, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
