const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
    // nechavam ve snake case, pac nechci jak kokot prejmenovavat ve front-endu na camel case
    kepler_name: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Planet', planetsSchema);