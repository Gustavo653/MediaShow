const { verifyToken } = require("../utils/jwtUtils");
const authMiddleware = require("./authMiddleware");

jest.mock("../utils/jwtUtils", () => ({
  verifyToken: jest.fn(),
}));

describe("Testes para o middleware de autenticação", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer token_valido",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Token válido e função de próxima chamada", () => {
    const user = { id: "123", role: "user" };
    verifyToken.mockReturnValue(user);

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith("Bearer token_valido");
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  test("Token inválido retorna erro 401", () => {
    verifyToken.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith("Bearer token_valido");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token inválido" });
  });

  test("Token ausente retorna erro 401", () => {
    req.headers.authorization = undefined;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token ausente" });
  });
});
