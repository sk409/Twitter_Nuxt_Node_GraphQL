"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addConstraint("Tweets", ["userId"], {
          type: "foreign key",
          name: "tweets_user_id_foreign",
          references: {
            table: "Users",
            field: "id"
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        })
      ],
      queryInterface.addConstraint("Tweets", ["parentId"], {
        type: "foreign key",
        name: "tweets_parent_id_foreign",
        references: {
          table: "Tweets",
          field: "id"
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeConstraint("Tweets", "tweets_user_id_foreign"),
      await queryInterface.removeIndex("Tweets", "tweets_user_id_foreign"),
      await queryInterface.removeConstraint(
        "Tweets",
        "tweets_parent_id_foreign"
      ),
      await queryInterface.removeIndex("Tweets", "tweets_parent_id_foreign")
    ];
  }
};
