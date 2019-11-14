require('dotenv').config()
const express = require('express');
const inquirer = require('inquirer');
const social = require("./models/social_model.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function searchPlaylistGenre() {
    inquirer.prompt([
        {
            name: "genreName",
            type: "input",
            message: "Know the genre of a playlist? Search here."
        }
    ]).then(async function (response) {
        let playlistSearch = social.selectPlaylistByGenre(response.genreName, result => {
            console.log(result);
        });
        console.log(playlistSearch);
    })
};

function searchPlaylists() {
    inquirer.prompt([
        {
            name: "playlistQuery",
            type: "input",
            message: "Know the name of a playlist? Search here."
        }
    ]).then(async function (response) {
        let playlistSearch = social.selectPlaylistByName(response.playlistQuery, result => {
            console.log(result);
        });
        let playlistSongs = social.selectPlaylistSongs(response.playlistQuery, result => {
            console.log(result);
        });
        console.log(response.playlistQuery, playlistSearch, playlistSongs);
    })
}

// Import routes and give the server access to them.
var routes = require("./controllers/lastfm_controller.js");

app.use(routes);

app.listen(port, () => {
    console.log(`Now listening to port ${port}. Enjoy your stay!`);
});