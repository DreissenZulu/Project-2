require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import routes and give the server access to them.
var routes = require("./controllers/lastfm_controller.js");

app.use(routes);

app.listen(port, () => {
    console.log(`Now listening to port ${port}. Enjoy your stay!`);
});