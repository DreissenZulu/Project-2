const express = require("express");
// Import the burger module to access database functions
const social = require("../models/social_model.js");
const LastFM = require('last-fm');

const lastfm = new LastFM(process.env.API);
const router = express.Router();

function searchAll(query) {
    return new Promise(resolve => {
        lastfm.search({ q: query, limit: 3 }, (err, data) => {
            if (err) throw err;
            else {
                resolve(data);
            }
        })
    })
}

function searchSongTitle(trackTitle) {
    return new Promise(resolve => {
        lastfm.trackSearch({ q: trackTitle, limit: 10 }, (err, data) => {
            if (err) throw err
            else {
                resolve(data);
            }
        })
    })
}

function searchArtist(artistName) {
    return new Promise(resolve => {
        lastfm.artistSearch({ q: artistName, limit: 10 }, (err, data) => {
            if (err) throw err
            else {
                resolve(data);
            }
        })
    })
}

function searchAlbum(albumName, artist) {
    return new Promise(resolve => {
        lastfm.albumInfo({ name: albumName, artistName: artist }, (err, data) => {
            if (err) throw err
            else {
                resolve(data);
            }
        })
    })
}

router.get("/", (req, res) => {
    res.sendFile("index.html")
})

router.get("/last-fm/search/:query/:type?", async (req, res) => {
    console.log(req.params);
    let response;
    if (req.params.type == "artist") {
       response = await searchArtist(req.params.query);
       console.log(response);
    } else if (req.params.type == "song") {
        response = await searchSongTitle(req.params.query);
        console.log(response);
    } else {
        response = await searchAll(req.params.query);
        console.log(response.result.top, response.result.artists, response.result.tracks, response.result.albums)
    }
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
        if (userOnServer != undefined) {
            console.log(`Authenticating...`);
            setTimeout(async function () {
                if (social.checkPass(req.body.password, userOnServer.password)) {
                    social.userLoggedIn(userOnServer.id, () => {
                        let currUser = {
                            id: userOnServer.id,
                            userName: userOnServer.userName,
                            firstName: userOnServer.first_name,
                            lastName: userOnServer.last_name
                        }
                        res.status(200).send(currUser);
                        console.log("Logged in successfully!");
                    });

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