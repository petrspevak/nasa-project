const launches = new Map();

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

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    const lastFlightNumber = getAllLaunches().reduce((accumulator, currentValue) => {
        if (currentValue.flightNumber > accumulator) {
            return currentValue.flightNumber;
        }

        return accumulator;
    }, 0);

    const newFlightNumber = lastFlightNumber + 1;

    launches.set(
        newFlightNumber,
        Object.assign(launch, {
            flightNumber: newFlightNumber,
            customers: ['ZeroTM', 'NASA'],
            upcoming: true,
            success: true,
        })
    );
}

function deleteLaunch(id) {
    if (!launches.has(id)) {
        return false;
    }

    const launch = launches.get(id);
    launch.upcoming = false;
    launch.success = false;

    return launch;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    deleteLaunch,
};