const Log = require("../models/log");
const errorHandler = require("./errorHandler");

jest.mock("../models/log", () => ({
  create: jest.fn(),
}));

describe("Testes para o manipulador de erros", () => {
  let err;
  let req;
  let res;
  let next;

  beforeEach(() => {
    err = new Error("Erro de teste");
    err.statusCode = 400;

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Criação de log de erro com status, mensagem e ID do erro", async () => {
    const createdLog = {
      id: "log-id",
    };
    Log.create.mockResolvedValue(createdLog);

    await errorHandler(err, req, res, next);

    expect(Log.create).toHaveBeenCalledWith({
      message: JSON.stringify(err),
      type: "error",
    });
    expect(res.status).toHaveBeenCalledWith(err.statusCode);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
      errorId: createdLog.id,
      detail: err,
    });
  });

  test("Erro ao criar o log retorna erro 500", async () => {
    Log.create.mockRejectedValue(new Error("Erro ao criar o log"));

    await errorHandler(err, req, res, next);

    expect(Log.create).toHaveBeenCalledWith({
      message: JSON.stringify(err),
      type: "error",
    });
    expect(console.error).toHaveBeenCalledWith(
      "Erro ao criar o log:",
      expect.any(Error)
    );
    expect(res.status).toHaveBeenCalledWith(err.statusCode);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
      errorId: null,
      detail: err,
    });
  });
});
