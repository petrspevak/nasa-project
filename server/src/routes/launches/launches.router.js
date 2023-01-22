const express = require('express');

const launchesController = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', launchesController.getAllLaunches);
launchesRouter.post('/', launchesController.addNewLaunch);
launchesRouter.delete('/:id', launchesController.deleteLaunch);

module.exports = launchesRouter;