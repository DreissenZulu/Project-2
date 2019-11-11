const express = require("express");
// Import the burger module to access database functions
const social = require("../models/social_model.js");
const LastFM = require('last-fm');

const lastfm = new LastFM(process.env.API);

function searchAll(query) {
    lastfm.search({ q: query, limit: 3 }, (err, data) => {
        if (err) console.error(err)
        else console.log(data)
    })
}
function searchSongTitle(trackTitle) {
    lastfm.trackSearch({ q: trackTitle }, (err, data) => {
        if (err) console.error(err)
        else console.log(data)
    })
}

function searchArtist(artistName) {
    lastfm.artistSearch({ q: artistName }, (err, data) => {
        if (err) console.error(err)
        else console.log(data)
    })
}

function searchAlbum(albumName, artist) {
    lastfm.albumInfo({ name: albumName, artistName: artist }, (err, data) => {
        if (err) console.error(err)
        else {
            console.log(data)
            // console.log(data.result[0].images)
        }
    })
}

// The router is like using app = express(), where the server is defined in another file
let router = express.Router();

module.exports = router;