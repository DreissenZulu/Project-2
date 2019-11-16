const express = require("express");
const path = require("path");
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

function getSongDetails(trackTitle, artist) {
    return new Promise(resolve => {
        lastfm.trackInfo({ name: trackTitle, artistName: artist, limit: 10 }, (err, data) => {
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

function getArtistDetails(artistName) {
    return new Promise(resolve => {
        lastfm.artistInfo({ q: artistName }, (err, data) => {
            if (err) throw err
            else {
                resolve(data);
            }
        })
    })
}

function searchAlbum(albumName) {
    return new Promise(resolve => {
        lastfm.albumSearch({ q: albumName, limit: 10 }, (err, data) => {
            if (err) throw err
            else {
                resolve(data);
            }
        })
    })
}

router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', "indexlogged.html"))
})

router.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', "signup.html"))
})

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', "login.html"))
})

router.get("/album", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', "album.html"))
})

router.get("/track", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', "song.html"))
})

router.get("/playlist", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', "playlist.html"));
})

router.get("/playlist/:id", (req, res) => {
    let playlistInfo;
    let playlistSongs;
    social.selectPlaylistByID(req.params.id, async (result) => {
        playlistInfo = await result;
        social.selectPlaylistSongs(req.params.id, async (list) => {
            playlistSongs = await list;
            let allInfo = { playlist: playlistInfo, songs: playlistSongs };
            res.status(200).send(allInfo);
        })
    })
})

router.get("/playlists/:uID", (req, res) => {
    social.selectUserPlaylists(req.params.uID, (result) => {
        res.status(200).send(result);
    })
})

router.get("/playlists/fav/:uID", (req, res) => {
    social.selectFavouritePlaylists(req.params.uID, (result) => {
        res.status(200).send(result);
    })
})

router.get("/playlists/search/:query", (req, res) => {
    social.searchPlaylists(req.params.query, (result) => {
        res.status(200).send(result);
    })
})

router.get("/last-fm/search/:query/:type?", async (req, res) => {
    let response;
    if (req.params.type == "artist") {
        response = await searchArtist(req.params.query);
        res.status(200).send(response.result);
    } else if (req.params.type == "album") {
        response = await searchAlbum(req.params.query);
        res.status(200).send(response.result);
    } else if (req.params.type == "song") {
        response = await searchSongTitle(req.params.query);
        res.status(200).send(response.result);
    } else {
        response = await searchAll(req.params.query);
        res.status(200).send(
            {
                topResult: response.result.top,
                artistMatch: response.result.artists,
                songMatch: response.result.tracks,
                albumMatch: response.result.albums
            })
    }
})

router.get("/lastfm/album/:artist/:album", async (req, res) => {
    response = await social.getAlbumInfo(req.params.artist, req.params.album)
    res.status(200).send(response)
})

router.get("/lastfm/song/:artist/:track", async (req, res) => {
    response = await social.getTrackInfo(req.params.artist, req.params.track)
    res.status(200).send(response)
})

router.get("/yt/song/:artist/:track", async (req, res) => {
    response = await social.getYouTubeLink(req.params.artist, req.params.track)
    res.status(200).send(response)
})

router.post("/api/users", (req, res) => {
    social.addNewUser(req.body.username.toLowerCase(), req.body.password, req.body.firstName, req.body.lastName, (result) => {
        res.status(200).send(result);
    })
})

router.post("/api/playlists", (req, res) => {
    social.addNewPlaylist(req.body.playlistName, req.body.playlistGenre, req.body.playlistDesc, req.body.creatorID, () => {
        res.status(200).send();
    })
})

router.post("/api/playlists/fav", (req, res) => {
    social.addFavouritePlaylist(req.body.user, req.body.playlist, () => {
        res.status(200).send();
    })
})

router.post("/api/playlists/:pID", (req, res) => {
    social.addSongToPlaylist(req.body.songTitle, req.body.artistName, req.params.pID, () => {
        res.status(200).send();
    })
})

// Consolidates comment posting system to one route
router.post("/api/comments/:location/:id", (req, res) => {
    if (req.params.location == "mbid") {
        social.addOtherComment(req.body.comment, req.body.commenterID, req.params.id, () => {
            res.status(200).send();
        });
    } else if (req.params.location == "playlist") {
        social.addPlaylistComment(req.body.comment, req.body.commenterID, req.params.id, () => {
            res.status(200).send();
        });
    }
})

router.put("/api/users", (req, res) => {
    social.selectFromUsers(async function (result) {
        let allCredentials = await result;
        let userOnServer = allCredentials.find(obj => obj.userName === req.body.username)
        if (userOnServer != undefined) {
            if (social.checkPass(req.body.password, userOnServer.password)) {
                social.userLoggedIn(userOnServer.id, () => {
                    let currUser = {
                        id: userOnServer.id,
                        userName: userOnServer.userName,
                        firstName: userOnServer.first_name,
                        lastName: userOnServer.last_name,
                        confirmLogin: true
                    }
                    res.status(200).send(currUser);
                });

            } else {
                res.status(200).send("failed");
            }
        } else {
            res.status(200).send("failed");
        }
    })
})

router.put("/api/users/:id", (req, res) => {
    social.userLoggedOut(req.params.id, () => {
        let currUser = {
            id: "",
            userName: "",
            firstName: "",
            lastName: "",
            confirmLogin: false
        }
        res.status(200).send(currUser);
    })
})

router.put("/api/playlists/:status", (req, res) => {
    social.updateFavStatus(req.body.user, req.body.playlist, req.params.status, () => {
        res.status(200).send();
    })
})

router.delete("/api/playlists/:pID/:sID", async (req, res) => {
    social.selectPlaylistByID(req.params.pID, async (result) => {
        if (result[0].user_id == req.body.id) {
            social.removeSongInPlaylist(req.params.sID, () => {
                res.status(200).send();
            })
        }
    })
})

// The router is like using app = express(), where the server is defined in another file


module.exports = router;