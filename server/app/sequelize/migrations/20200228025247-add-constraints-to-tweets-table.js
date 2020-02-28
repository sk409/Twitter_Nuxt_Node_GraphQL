"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint("tweets", ["user_id"], {
        type: "foreign key",
        name: "users_tweets_foreign",
        references: {
          table: "users",
          field: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeConstraint("tweets", "users_tweets_foreign"),
      await queryInterface.removeIndex("tweets", "users_tweets_foreign")
    ];
  }
};
