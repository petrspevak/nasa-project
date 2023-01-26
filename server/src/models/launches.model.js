const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

// const launches = new Map();

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exproration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    destination: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);

async function getAllLaunches() {
    return await launches.find({}, { _id: 0, __v: 0 });
}

async function addNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    await saveLaunch(
        Object.assign(launch, {
            flightNumber: newFlightNumber,
            customers: ['ZeroTM', 'NASA'],
            upcoming: true,
            success: true,
        })
    );
}

async function deleteLaunch(flightNumber) {
    const launch = await launches.findOne({ flightNumber: flightNumber });
    if (!launch) {
        return false;
    }

    launch.upcoming = false;
    launch.success = false;
    const aborted = await launches.updateOne({ _id: launch['_id']}, launch);

    if (aborted.modifiedCount !== 1) {
        return false;
    }

    return launch;
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({ kepler_name: launch.destination });

    if (!planet) {
        throw new Error('No matching planet found!');
    }

    try {
        // await launches.updateOne({flightNumber: launch.flightNumber}, launch, {upsert: true});
        // nevrati zpatky dalsi properties objektu v "$setOnInsert"
        await launches.findOneAndUpdate({flightNumber: launch.flightNumber}, launch, {upsert: true});
    } catch (err) {
        console.log(`Failed to save launch: ${err}`);
    }
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches.findOne({}).sort('-flightNumber');

    if (!latestLaunch) {
        return 99;
    }

    return latestLaunch['flightNumber'];
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    deleteLaunch,
};