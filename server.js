const express = require('express');
const LastFM = require('last-fm');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const lastfm = new LastFM('f8b1480a23da4fd3f470499896175232');

function searchAll(query) {
    lastfm.search({ q: query, limit: 3}, (err, data) => {
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

function searchPlaylistGenre(genreName) {

}

app.listen(port, () => {
    console.log(`Now listening to port ${port}. Enjoy your stay!`);
})

searchAlbum('Toxicity', 'System Of A Down')