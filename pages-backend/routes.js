const express = require('express');
const db = require('./db');
const createAccountRouter = require('./account');
const paymentRouter = require('./payment');
const app = express();

app.use(createAccountRouter);
app.use(paymentRouter);

module.exports = app;
