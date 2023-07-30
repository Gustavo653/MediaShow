const adminMiddleware = require('../middleware/adminMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const DeviceMedia = require("../models/deviceMedia");
const express = require("express");
const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { deviceId, mediaId } = req.body;
        const deviceMedia = await DeviceMedia.create({ deviceId, mediaId });
        res.status(201).json(deviceMedia);
    } catch (error) {
        next({
            statusCode: 500,
            message: "Erro ao vincular a mídia ao dispositivo.",
            detail: error,
        });
    }
});

router.delete('/', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { deviceId, mediaId } = req.body;
        const deviceMedia = await DeviceMedia.findOne({ where: { deviceId, mediaId } });

        if (!deviceMedia) {
            return res.status(404).json({ message: 'Relação entre mídia e dispositivo não encontrada.' });
        }

        await deviceMedia.destroy();
        res.status(200).json({ message: 'Mídia desvinculada do dispositivo com sucesso.' });
    } catch (error) {
        next({
            statusCode: 500,
            message: "Erro ao desvincular a mídia do dispositivo.",
            detail: error,
        });
    }
});

module.exports = router;
