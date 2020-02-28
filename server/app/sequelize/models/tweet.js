'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    text: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Tweet.associate = function(models) {
    // associations can be defined here
  };
  return Tweet;
};