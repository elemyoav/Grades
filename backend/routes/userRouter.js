const express = require("express");

const User = require("../controllers/userController");

const router = express.Router();

router.route('/').post(User.AddUser).get(User.GetUser);
router.route('/names').get(User.GetUserNames);

module.exports =  router;