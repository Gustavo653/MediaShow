const Log = require("../models/log");

const infoHandler = async (req, res, next) => {
  try {
    const json = req.body;
    const headers = req.headers;
    const logMessage = {
      json,
      headers,
    };
    await Log.create({
      message: JSON.stringify(logMessage),
      type: "info",
    });
    next();
  } catch (error) {
    console.error("Erro ao criar o log de informação:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error.message,
    });
  }
};

module.exports = infoHandler;
