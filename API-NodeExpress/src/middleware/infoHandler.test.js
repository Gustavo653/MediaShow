const Log = require("../models/log");
const infoHandler = require("./infoHandler");

jest.mock("../models/log", () => ({
  create: jest.fn(),
}));

describe("Testes para o manipulador de informações", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: { data: "dados" },
      headers: { header: "valor" },
    };
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

  test("Criação de log de informação e função de próxima chamada", async () => {
    await infoHandler(req, res, next);

    expect(Log.create).toHaveBeenCalledWith({
      message: JSON.stringify({ json: req.body, headers: req.headers }),
      type: "info",
    });
    expect(next).toHaveBeenCalled();
  });

  test("Erro ao criar o log de informação retorna erro 500", async () => {
    const errorMessage = "Erro ao criar o log de informação";
    Log.create.mockRejectedValue(new Error(errorMessage));

    await infoHandler(req, res, next);

    expect(Log.create).toHaveBeenCalledWith({
      message: JSON.stringify({ json: req.body, headers: req.headers }),
      type: "info",
    });
    expect(console.error).toHaveBeenCalledWith(
      "Erro ao criar o log de informação:",
      expect.any(Error)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Erro interno do servidor",
      error: errorMessage,
    });
  });
});
