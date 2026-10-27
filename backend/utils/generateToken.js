
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.SECRET_CODE,
        { expiresIn: "1d" }
    );
};

module.exports = generateToken;
