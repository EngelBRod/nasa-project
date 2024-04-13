const express = require('express');

const planetsRouter = require('./planets/planets.routers');
const launchesRouter = require('./launches/launches.routers');

const api = express.Router();

api.use('/launches', launchesRouter);
api.use('/planets',planetsRouter);


module.exports = api;