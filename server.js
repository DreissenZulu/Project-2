require('dotenv').config()
const express = require('express');
const inquirer = require('inquirer');
const social = require("./models/social_model.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


function createPlaylist() {
    if (currUser.userName == "") {
        console.log("Please log in to create a playlist.");
        return;
    }
    inquirer.prompt([
        {
            name: "playlistTitle",
            type: "input",
            message: `Enter playlist name, ${currUser.firstName}.`
        },
        {
            name: "playlistDescription",
            type: "input",
            message: `Enter playlist description.`
        },
        {
            name: "playlistGenre",
            type: "input",
            message: "Select the genre of the playlist"
        }
    ]).then(async function (response) {
        social.addNewPlaylist(response.playlistTitle, response.playlistGenre, response.playlistDescription, currUser.id, function (result) {
        })
    })
}

async function devTestAddToPlaylist() {
    let userPlaylists = social.selectUserPlaylists(currUser.id, result => {
        console.log(result);
    });
    inquirer.prompt([
        {
            name: "playlistName",
            type: "list",
            messages: "Choose playlist to add song to",
            choices: userPlaylists.map(obj => obj.playlist_name)
        },
        {
            name: "mbid",
            type: "input",
            message: "Enter mbid of song"
        },
        {
            name: "songTitle",
            type: "input",
            message: "Enter song title"
        }
    ]).then(async function (response) {
        let playlistID = userPlaylists.find(obj => obj.playlist_name === response.playlistName).id;
        social.addSongToPlaylist(response.songTitle, response.mbid, playlistID, result => {
            console.log(result);
        });
    })
}

async function addToPlaylist(mbid, songTitle, playlistID) {

}

// Provided an mbid, link a new comment from the frontend to it
async function commentOnSongAlbum() {
    inquirer.prompt([
        {
            name: "mbid",
            type: "input",
            message: "Choose song or album to add comment to",
        },
        {
            name: "comment",
            type: "input",
            message: "Enter your comment"
        }
    ]).then(async function (response) {
        social.addOtherComment(response.comment, currUser.id, response.mbid, result => {
            console.log(result);
        });
    })
}

// Provided a playlist id, link a new comment from the frontend to it
async function commentOnPlaylist() {
    let playlists = social.selectPlaylists(result => {
        console.log(result);
    });
    inquirer.prompt([
        {
            name: "playlistName",
            type: "list",
            messages: "Choose playlist to add song to",
            choices: playlists.map(obj => obj.playlist_name)
        },
        {
            name: "comment",
            type: "input",
            message: "Enter your comment"
        }
    ]).then(async function (response) {
        let playlistID = playlists.find(obj => obj.playlist_name === response.playlistName).id;
        social.addPlaylistComment(response.comment, currUser.id, playlistID, result => {
            console.log(result);
        });
    })
}

async function clearToken() {
    let allCredentials = social.selectFromUsers(result => {
        console.log(result);
    });
    let userOnServer = allCredentials.find(obj => obj.userName === currUser.userName)
    social.userLoggedOut(userOnServer.id, result => {
        console.log(result);
    });
    currUser.id = "";
    currUser.userName = "";
    currUser.firstName = "";
    currUser.lastName = "";
};

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