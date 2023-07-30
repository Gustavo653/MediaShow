const adminMiddleware = require('../middleware/adminMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const Device = require("../models/device");
const express = require("express");
const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { serialNumber, name } = req.body;
        const device = await Device.create({ serialNumber, name });
        res.status(201).json(device);
    } catch (error) {
        next({
            statusCode: 500,
            message: "Erro ao criar o dispositivo.",
            detail: error,
        });
    }
});

router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const deviceList = await Device.findAll();
        res.status(200).json(deviceList);
    } catch (error) {
        next({
            statusCode: 500,
            message: "Erro ao obter os dispositivos.",
            detail: error,
        });
    }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { serialNumber, name } = req.body;

        const device = await Device.findByPk(id);
        if (!device) {
            return res.status(404).json({ message: 'Dispositivo não encontrado.' });
        }

        await device.update({ serialNumber, name });
        res.status(200).json(device);
    } catch (error) {
        next({
            statusCode: 500,
            message: "Erro ao atualizar o dispositivo.",
            detail: error,
        });
    }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        const device = await Device.findByPk(id);
        if (!device) {
            return res.status(404).json({ message: 'Dispositivo não encontrado.' });
        }

        await device.destroy();
        res.status(200).json({ message: 'Dispositivo excluído com sucesso.' });
    } catch (error) {
        next({
            statusCode: 500,
            message: "Erro ao excluir o dispositivo.",
            detail: error,
        });
    }
});

module.exports = router;