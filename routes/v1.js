const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const db =  require('../db');

const signin = require('../controllers/signin');
const register = require('../controllers/register');
const auth = require('../controllers/authorization');

/* GET home page. */
router.get('/v1', auth.requireAuth, (req, res) => res.send('test'));
router.post('/v1/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
router.post('/v1/authenticate', signin.signinAuthentication(db, bcrypt));

module.exports = router;
