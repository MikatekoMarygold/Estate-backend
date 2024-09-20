const express = require('express');
const user = require('../Controllers/user');
const router = express.Router();

//Get
router.get('/',user.defaultRoute);

module.exports = router;