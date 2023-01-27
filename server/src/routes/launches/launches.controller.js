const launchesModel = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function getAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await launchesModel.getAllLaunches(skip, limit);

    res.status(200).json(launches);
}

async function addNewLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination) {
        // return davam jen od toho, aby se fce ukoncila - neni povinny a nepouziva se
        return res.status(400).json({error: 'Invalid data'});
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate.valueOf())) {
        return res.status(400).json({error: 'Invalid launch date'});
    }

    try {
        await launchesModel.addNewLaunch(launch);
    } catch (err) {
        return res.status(400).json({error: err.toString()});
    }

    return res.status(201).json(launch);
}

async function deleteLaunch(req, res) {
    const launchId = Number(req.params.id);

    const deleteLaunchResult = await launchesModel.deleteLaunch(launchId);
    if (deleteLaunchResult) {
        return res.status(200).json(deleteLaunchResult);
    }

    return res.status(404).json({
        error: 'Launch with this number not found or is not upcoming!',
    });
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    deleteLaunch,
};
