const adminMiddleware = require('../middleware/adminMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const Media = require("../models/media");
const express = require("express");
const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { url, name } = req.body;
        const media = await Media.create({ url, name });
        res.status(201).json(media);
    } catch (error) {
        next({
            statusCode: 500,
            message: "Erro ao criar a mídia.",
            detail: error,
        });
    }
});

router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const mediaList = await Media.findAll();
        res.status(200).json(mediaList);
    } catch (error) {
        next({
            statusCode: 500,
            message: "Erro ao obter as mídias.",
            detail: error,
        });
    }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { url, name } = req.body;

        const media = await Media.findByPk(id);
        if (!media) {
            return res.status(404).json({ message: 'Mídia não encontrada.' });
        }

        await media.update({ url, name });
        res.status(200).json(media);
    } catch (error) {
        next({
            statusCode: 500,
            message: "Erro ao atualizar a mídia.",
            detail: error,
        });
    }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        const media = await Media.findByPk(id);
        if (!media) {
            return res.status(404).json({ message: 'Mídia não encontrada.' });
        }

        await media.destroy();
        res.status(200).json({ message: 'Mídia excluída com sucesso.' });
    } catch (error) {
        next({
            statusCode: 500,
            message: "Erro ao excluir a mídia.",
            detail: error,
        });
    }
});

module.exports = router;