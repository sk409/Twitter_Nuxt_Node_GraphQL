"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint("Tweets", ["userId"], {
        type: "foreign key",
        name: "users_tweets_foreign",
        references: {
          table: "Users",
          field: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeConstraint("Tweets", "users_tweets_foreign"),
      await queryInterface.removeIndex("Tweets", "users_tweets_foreign")
    ];
  }
};
