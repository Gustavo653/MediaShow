const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Device = sequelize.define("Devices", {
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Device;
