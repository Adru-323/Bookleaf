const express = require("express");
const login = require("../controllers/authController.js");
const route = express();

route.post("/login",login)

module.exports = route;