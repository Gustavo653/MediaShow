const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Media = sequelize.define("Medias", {
  url: {
    type: DataTypes.BLOB,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Media;
