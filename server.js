//import dependencies
const express = require('express');
const cors = require('cors');

//import utils
const {connectToDB} = require('./utils/db');
require('dotenv').config();

// eslint-disable-next-line no-undef
const {PORT} = process.env;
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log(req.body);
});

app.listen(PORT, async () => {
    await connectToDB();
    console.log(`WAAH app listening at http://localhost:${PORT}`);
});

