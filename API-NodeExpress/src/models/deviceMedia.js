const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");
const Device = require("./device");
const Media = require("./media");

const DeviceMedia = sequelize.define("DeviceMedias", {
  deviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mediaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Device.belongsToMany(Media, { through: DeviceMedia, foreignKey: 'deviceId', otherKey: 'mediaId' });
Media.belongsToMany(Device, { through: DeviceMedia, foreignKey: 'mediaId', otherKey: 'deviceId' });

module.exports = DeviceMedia;