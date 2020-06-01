const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const db =  require('../db');

const signin = require('../controllers/signin');
const register = require('../controllers/register');
const auth = require('../controllers/authorization');
const { createPayment, getPayments, getPayment } = require('../controllers/payments');
const { paymentParamValidationRules, paymentValidationRules, validate } = require('../controllers/validator')

/* GET home page. */
router.get('/v1', auth.requireAuth, (req, res) => res.send('payment api'));
router.post('/v1/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
router.post('/v1/authenticate', signin.signinAuthentication(db, bcrypt));

router.get('/v1/payments', auth.requireAuth, (req, res) => getPayments(req, res, db));
router.get('/v1/payments/:id', paymentParamValidationRules(), validate, auth.requireAuth, (req, res) => getPayment(req, res, db));
router.post('/v1/payments', paymentValidationRules(), validate, auth.requireAuth, (req, res) => createPayment(req, res, db));

module.exports = router;
