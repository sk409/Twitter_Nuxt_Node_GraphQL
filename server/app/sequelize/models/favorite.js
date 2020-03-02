"use strict";
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define(
    "Favorite",
    {
      tweetId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    },
    {}
  );
  Favorite.associate = function(models) {
    // associations can be defined here
  };
  Favorite.removeAttribute("id");
  return Favorite;
};
