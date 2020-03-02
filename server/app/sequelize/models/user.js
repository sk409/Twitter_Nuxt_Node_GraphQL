"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      nickname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      profileImagePath: DataTypes.STRING
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
