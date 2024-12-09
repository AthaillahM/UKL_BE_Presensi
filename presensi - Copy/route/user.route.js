const express = require('express');
const app =express();
app.use(express.json());
const userController = require('../controller/user.controller.js');
const {authorize} = require('../controller/auth.contoller.js');

app.get('/',userController.getAlluser);
app.get('/:id', [authorize],userController.findByID);
app.post('/find',[authorize],userController.finduser);
app.post('/', [authorize],userController.adduser);
app.put('/:id', [authorize],userController.updateuser);
app.delete('/:id', [authorize],userController.deleteuser);

module.exports = app;
