const express = require("express");
const router = express.Router();
const log = require("../models/log");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Endpoint para obter logs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the log
 *         message:
 *           type: string
 *           description: The message of your log
 *         type:
 *           type: string
 *           description: The type of your log
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the log was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the log was updated
 *       example:
 *         id: 2222
 *         message: ::1 - GET /logs HTTP/1.1 200 10225 - 18.333 ms\n
 *         type: network
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Obtém os logs
 *     tags: [Logs]
 *     security:
 *       - authMiddleware: []
 *       - adminMiddleware: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 */


router.get("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    let logs = await log.findAll({
      order: [["id", "DESC"]],
      limit: 1000,
    });

    const logsWithMessage = logs.map((entry) => {
      const message = entry.message.toString("utf8");
      return { ...entry.toJSON(), message };
    });

    res.json(logsWithMessage);
  } catch (error) {
    next({
      statusCode: 500,
      message: "Erro ao obter os logs.",
      detail: error,
    });
  }
});

module.exports = router;
