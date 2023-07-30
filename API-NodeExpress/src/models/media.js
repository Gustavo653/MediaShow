const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Media = sequelize.define("Medias", {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Media;
