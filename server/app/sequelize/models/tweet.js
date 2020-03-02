'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    text: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Tweet.associate = function(models) {
    // associations can be defined here
  };
  return Tweet;
};