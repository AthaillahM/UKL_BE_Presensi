const express = require('express');
const app = express();
app.use(express.json());

const { autenticate } = require('../controller/auth.contoller.js'); // Destructure the function from the object

app.post('/', autenticate);

module.exports = app;
