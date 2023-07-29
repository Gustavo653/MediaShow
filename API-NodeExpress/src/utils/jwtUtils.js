const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (userId, role) => {
  const payload = {
    user: {
      id: userId,
      role: role,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    return decoded.user;
  } catch (error) {
    throw new Error("Token inválido");
  }
};

const generatePassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

module.exports = {
  generateToken,
  verifyToken,
  generatePassword,
};
