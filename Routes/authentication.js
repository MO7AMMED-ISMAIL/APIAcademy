const express = require("express");
const router = express.Router();
const {login} = require("../Controller/authenticationController");

router.route('/login').post(login);

module.exports = router;