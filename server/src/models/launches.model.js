const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const launch = {
    flightNumber: 100, // flight_number
    mission: 'Kepler Exproration X', // name
    rocket: 'Explorer IS1', // rocket.name
    launchDate: new Date('December 27, 2030'), // date_local
    destination: 'Kepler-442 b', // not applicable
    customers: ['ZTM', 'NASA'], // payload.customers for each payload
    upcoming: true, // upcoming
    success: true, // success
};

saveLaunch(launch);

async function loadLaunchesData() {
    console.log('Loading data prom SpaceX API...');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap(payload => payload.customers);

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: new Date(launchDoc['date_local']),
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }

        console.log(`${launch.flightNumber} ${launch.mission}`)
    }
}

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
    loadLaunchesData,
    getAllLaunches,
    addNewLaunch,
    deleteLaunch,
};