const router = require('express').Router();
const { validateToken } = require('../controllers/auth.controller');
const apiAuth = require('./api/auth');
const apiUser = require('./api/user');
const apiRegion = require('./api/region');
const apiCountry = require('./api/country');
const apiCity = require('./api/city');

router.use('/auth', apiAuth);
router.use('/user', validateToken, apiUser);
router.use('/region', validateToken, apiRegion);
router.use('/country', validateToken, apiCountry);
router.use('/city', validateToken, apiCity);

module.exports = router;
