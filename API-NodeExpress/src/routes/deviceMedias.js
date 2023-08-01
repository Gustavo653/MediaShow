const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const DeviceMedia = require("../models/deviceMedia");
const express = require("express");
const { refreshAllClients } = require("./webSocket");
const Device = require("../models/device");
const Media = require("../models/media");
const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const deviceMedias = await DeviceMedia.findAll({
      include: [{ model: Device }, { model: Media }],
    });

    deviceMedias.forEach((deviceMedia) => {
      deviceMedia.Media.url = deviceMedia.Media.url.toString();
    });

    res.status(201).json(deviceMedias);
  } catch (error) {
    next({
      statusCode: 500,
      message: "Erro ao vincular a mídia ao dispositivo.",
      detail: error,
    });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { deviceId, mediaId, time } = req.body;
    const existingDeviceMedia = await DeviceMedia.findOne({
      where: { deviceId, mediaId },
    });
    if (existingDeviceMedia) {
      existingDeviceMedia.time = time;
      await existingDeviceMedia.save();
      res.status(200).json(existingDeviceMedia);
    } else {
      const deviceMedia = await DeviceMedia.create({ deviceId, mediaId, time });
      res.status(201).json(deviceMedia);
    }
    refreshAllClients();
  } catch (error) {
    next({
      statusCode: 500,
      message: "Erro ao vincular a mídia ao dispositivo.",
      detail: error,
    });
  }
});

router.delete(
  "/:deviceId/:mediaId",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const { deviceId, mediaId } = req.params;
      const deviceMedia = await DeviceMedia.findOne({
        where: { deviceId, mediaId },
      });

      if (!deviceMedia) {
        return res
          .status(404)
          .json({
            message: "Relação entre mídia e dispositivo não encontrada.",
          });
      }

      await deviceMedia.destroy();
      refreshAllClients();
      res
        .status(200)
        .json({ message: "Mídia desvinculada do dispositivo com sucesso." });
    } catch (error) {
      next({
        statusCode: 500,
        message: "Erro ao desvincular a mídia do dispositivo.",
        detail: error,
      });
    }
  }
);

module.exports = router;
