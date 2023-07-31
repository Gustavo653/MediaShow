require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const http = require('http');

const usersRouter = require("./routes/users");
const logsRouter = require("./routes/logs");
const devicesRouter = require("./routes/devices");
const mediasRouter = require("./routes/medias");
const deviceMediasRouter = require("./routes/deviceMedias");
const log = require("./models/log");
const errorHandler = require("./middleware/errorHandler");
const infoHandler = require("./middleware/infoHandler");
const multer = require('multer');

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { createWebSocketServer } = require("./routes/webSocket");

const app = express();
app.use(cors());
const server = http.createServer(app);

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "MediaShow Express API with Swagger",
      version: "1.0.0",
      description:
        "MediaShow Express API with Swagger",
    },
  },
  apis: ["src/routes/*.js"],
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(options), { explorer: true })
);

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
app.use(multerMid.single('file'));

const port = process.env.PORT;

async function startServer() {
  server.listen(port, () => {
    console.log(`Server running at port ${port}`);
  });
}

app.use(
  morgan("short", {
    stream: {
      write: (message) => {
        log.create({ message, type: "network" });
      },
    },
  })
);

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));

app.use(infoHandler);

createWebSocketServer(server);
app.use("/users", usersRouter);
app.use("/logs", logsRouter);
app.use("/medias", mediasRouter);
app.use("/devices", devicesRouter);
app.use("/device-medias", deviceMediasRouter);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Página não encontrada",
    error: {
      statusCode: 404,
      message: "Você acessou uma rota que não está definida neste servidor",
    },
  });
});

app.use(errorHandler);

startServer();

module.exports = app;
