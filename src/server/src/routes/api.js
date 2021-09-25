const router = require('express').Router();
const { validateToken } = require('../controllers/auth.controller');
const apiAuth = require('./api/auth');
const apiUser = require('./api/user');
const apiRegion = require('./api/region');
const apiCountry = require('./api/country');
const apiCity = require('./api/city');
const apiCompany = require('./api/company');
const apiChannel = require('./api/channel');
const apiContact = require('./api/contact');

router.use('/auth', apiAuth);
router.use('/user', validateToken, apiUser);
router.use('/region', validateToken, apiRegion);
router.use('/country', validateToken, apiCountry);
router.use('/city', validateToken, apiCity);
router.use('/company', validateToken, apiCompany);
router.use('/channel', validateToken, apiChannel);
router.use('/contact', validateToken, apiContact);

module.exports = router;
