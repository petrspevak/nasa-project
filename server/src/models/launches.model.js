const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
const SPACEX_SEARCH_DATA = {
    query: {},
    options: {
        pagination: false,
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
};


// dal tenhle launch nepotrebuju
// const launch = {
//     flightNumber: 100, // flight_number
//     mission: 'Kepler Exproration X', // name
//     rocket: 'Explorer IS1', // rocket.name
//     launchDate: new Date('December 27, 2030'), // date_local
//     destination: 'Kepler-442 b', // not applicable
//     customers: ['ZTM', 'NASA'], // payload.customers for each payload
//     upcoming: true, // upcoming
//     success: true, // success
// };
//
// saveLaunch(launch);


async function loadLaunchesData() {
    // nechci stahovat lety pokazde
    if ((await launches.count({})) > 50) {
        console.log('Data from SpaceX API already loaded...');
        return;
    }

    console.log('Loading data from SpaceX API...');
    const response = await axios.post(SPACEX_API_URL, SPACEX_SEARCH_DATA);

    if (response.status !== 200) {
        const errorMsg = 'Error downloading data from SpaceX API';
        console.log(errorMsg);

        throw new Error(errorMsg);
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const rawCustomers = payloads.flatMap(payload => payload.customers);
        // customer se muze opakovat u vice payloadu - proto taham unikatni hodnoty, tohle je nejcitsi zpusob:
        const customers = [...new Set(rawCustomers)];

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: new Date(launchDoc['date_local']),
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }

        saveLaunch(launch);
        console.log(`${launch.flightNumber} ${launch.mission}`)
    }
}

async function getAllLaunches(skip = 0, limit = 0) {
    return await launches
        .find({}, { _id: 0, __v: 0 })
        .sort('flightNumber')
        .skip(skip)
        .limit(limit)
    ;
}

async function addNewLaunch(launch) {
    const planet = await planets.findOne({ kepler_name: launch.destination });

    if (!planet) {
        throw new Error('No matching planet found!');
    }

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