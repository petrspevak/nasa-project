const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-api:l4SoxK6dt7tyx1dw@tutorialcluster.uvyzlbc.mongodb.net/nasaDB?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready.');
});

mongoose.connection.on('error', err => {
    console.error(err);
});

mongoose.connect(MONGO_URL);

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
};

