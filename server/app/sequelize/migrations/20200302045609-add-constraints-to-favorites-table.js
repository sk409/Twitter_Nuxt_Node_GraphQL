"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addConstraint("Favorites", ["tweetId"], {
        type: "foreign key",
        name: "favorites_tweet_id_foreign",
        references: {
          table: "Tweets",
          field: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      }),
      await queryInterface.addConstraint("Favorites", ["userId"], {
        type: "foreign key",
        name: "favorites_user_id_foreign",
        references: {
          table: "Users",
          field: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      })
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeConstraint(
        "Favorites",
        "favorites_tweet_id_foreign"
      ),
      await queryInterface.removeConstraint(
        "Favorites",
        "favorites_user_id_foreign"
      )
    ];
  }
};
