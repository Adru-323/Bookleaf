const express = require("express");
const router = express();
const authmiddleware = require("../middleware/authmiddleware.js");
const {getMyBooks} = require("../controllers/bookController.js");

router.get("/my-books",authmiddleware,getMyBooks);

module.exports = router;