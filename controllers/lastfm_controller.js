const express = require("express");
// Import the burger module to access database functions
const social = require("../models/social_model.js");
const LastFM = require('last-fm');

const lastfm = new LastFM(process.env.API);
const router = express.Router();

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

router.get("/", function(req, res) {
    res.sendFile("index.html")
})

router.post("/api/users", (req, res) => {
    social.addNewUser(req.body.username.toLowerCase(), req.body.password, req.body.firstName, req.body.lastName, () => {
        res.status(200).send();
    })
})

router.put("/api/users", (req, res) => {
    social.selectFromUsers(async function (result) {
        let allCredentials = await result;
        let userOnServer = allCredentials.find(obj => obj.userName === req.body.username)
        console.log(userOnServer);
        if (userOnServer != undefined) {
            console.log(`Authenticating...`);
            setTimeout(async function () {
                console.log(userOnServer.password);
                if (social.checkPass(req.body.password, userOnServer.password)) {
                    console.log(`Hello there ${userOnServer.first_name}!`)
                    social.userLoggedIn(userOnServer.id, result => {
                        console.log(result);
                        res.status(200).send();
                    });
                    // currUser.id = userOnServer.id;
                    // currUser.userName = userOnServer.userName;
                    // currUser.firstName = userOnServer.first_name;
                    // currUser.lastName = userOnServer.last_name;
                } else {
                    console.log(`Invalid password!!`);
                }
            }, 1500);
        } else {
            console.log(`Invalid username!`);
        }
    })
})

// The router is like using app = express(), where the server is defined in another file


module.exports = router;