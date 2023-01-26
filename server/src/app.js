const path = require('path');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiRouter = require('./routes/api.router');
const launchesRouter = require('./routes/launches/launches.router');

const app = express();


app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', apiRouter);

// /* - routa, ktera se nechytla na predchozich, se preda Reacti aplikaci
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


module.exports = app;