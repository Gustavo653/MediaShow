const bcrypt = require("bcrypt");
const { generateToken, verifyToken, generatePassword } = require("./jwtUtils");

describe("Testes para funções de autenticação", () => {
  let token;
  const userId = "123";
  const role = "admin";
  const password = "senha123";

  beforeAll(() => {
    process.env.JWT_SECRET = "segredo";
    process.env.JWT_EXPIRATION = "1h";
  });

  test("Gerar token válido", () => {
    token = generateToken(userId, role);
    expect(token).toBeTruthy();
  });

  test("Verificar token válido", () => {
    const decodedUser = verifyToken(token);
    expect(decodedUser).toEqual({ id: userId, role: role });
  });

  test("Verificar token inválido", () => {
    const invalidToken = "token_invalido";
    expect(() => {
      verifyToken(invalidToken);
    }).toThrow("Token inválido");
  });

  test("Gerar hash de senha", async () => {
    const hashedPassword = await generatePassword(password);
    expect(hashedPassword).toBeTruthy();
  });

  test("Comparar senha com hash válido", async () => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    expect(passwordMatch).toBe(true);
  });

  test("Comparar senha com hash inválido", async () => {
    const invalidPassword = "senha_incorreta";
    const hashedPassword = await bcrypt.hash(password, 10);
    const passwordMatch = await bcrypt.compare(invalidPassword, hashedPassword);
    expect(passwordMatch).toBe(false);
  });
});
