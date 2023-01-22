const launchesModel = require('../../models/launches.model')

function getAllLaunches(req, res) {
    res.status(200).json(launchesModel.getAllLaunches());
}

function addNewLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination) {
        // return davam jen od toho, aby se fce ukoncila - neni povinny a nepouziva se
        return res.status(400).json({error: 'Invalid data'});
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate.valueOf())) {
        return res.status(400).json({error: 'Invalid launch date'});
    }

    launchesModel.addNewLaunch(launch);

    return res.status(201).json(launch);
}

function deleteLaunch(req, res) {
    const launchId = Number(req.params.id);

    const deleteLaunchResult = launchesModel.deleteLaunch(launchId);
    if (deleteLaunchResult) {
        return res.status(200).json(deleteLaunchResult);
    }

    return res.status(404).json({
        error: 'Launch with this number not found',
    });
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    deleteLaunch,
};
