const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const {
  generateToken,
  verifyToken,
  generatePassword,
} = require("../utils/jwtUtils");

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ where: { email: email } });
    if (!foundUser) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = generateToken(foundUser.id, foundUser.role);

    res.json({ token });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Erro ao autenticar usuário.",
      detail: error,
    });
  }
});

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next({
      statusCode: 500,
      message: "Erro ao recuperar usuários.",
      detail: error,
    });
  }
});

router.get("/current", authMiddleware, async (req, res, next) => {
  try {
    const decoded = verifyToken(req.headers.authorization);
    const currentUser = await User.findByPk(decoded.id);
    res.json(currentUser);
  } catch (error) {
    next({
      statusCode: 500,
      message: "Erro ao recuperar usuário.",
      detail: error,
    });
  }
});

router.get("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const foundUser = await User.findByPk(userId);
    if (foundUser) {
      res.json(foundUser);
    } else {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (error) {
    next({
      statusCode: 500,
      message: "Erro ao recuperar usuário.",
      detail: error,
    });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let role = req.body.role;
    let password = req.body.password ?? "admin123";
    password = await generatePassword(password);

    if (role !== "admin" && role !== "viewer") {
      return res
        .status(400)
        .json({ message: "O role deve ser admin ou viewer." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "E-mail já está em uso." });
    }

    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    res.json(createdUser);
  } catch (error) {
    next({
      statusCode: 500,
      message: "Erro ao criar usuário",
      detail: error,
    });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.id;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let role = req.body.role;
    let password = req.body.password;

    const existingUser = await User.findOne({
      where: { email, id: { [Op.not]: userId } },
    });

    if (existingUser) {
      return res.status(400).json({ message: "E-mail já está em uso." });
    }

    if (password) {
      password = await generatePassword(password);
    } else {
      const user = await User.findByPk(userId);
      password = user.password;
    }

    const updatedUser = await User.update(
      { firstName, lastName, email, password, role },
      { where: { id: userId } }
    );

    if (updatedUser[0] === 1) {
      res.json({ message: "Usuário atualizado com sucesso." });
    } else {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (error) {
    console.log(error);
    next({
      statusCode: 500,
      message: "Erro ao atualizar usuário",
      detail: error,
    });
  }
});

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.destroy({ where: { id: userId } });

      if (deletedUser === 1) {
        res.json({ message: "Usuário excluído com sucesso." });
      } else {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
    } catch (error) {
      next({
        statusCode: 500,
        message: "Erro ao excluir usuário.",
        detail: error,
      });
    }
  }
);

module.exports = router;
