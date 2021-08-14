const router = require('express').Router();
const { validateToken } = require('../controllers/auth.controller');
const apiAuth = require('./api/auth');
const apiUser = require('./api/user');

router.use('/auth', apiAuth);
router.use('/user', validateToken, apiUser);

module.exports = router;
