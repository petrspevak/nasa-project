const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT ?? 8000;

const MONGO_URL = 'mongodb+srv://nasa-api:l4SoxK6dt7tyx1dw@tutorialcluster.uvyzlbc.mongodb.net/nasaDB?retryWrites=true&w=majority';

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready.');
});

async function startServer() {
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();
    server.listen(8000, () => console.log(`Server runs on port ${PORT}`));
}

startServer();