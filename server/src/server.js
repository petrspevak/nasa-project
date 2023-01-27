const http = require('http');

require('dotenv').config(); // volam co nejdriv, aby byly promenne z .env k dispozici

const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model')

const PORT = process.env.PORT ?? 8000;


const server = http.createServer(app);


async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();
    server.listen(8000, () => console.log(`Server runs on port ${PORT}`));
}

startServer();