require('dotenv').config({path: __dirname + '/.env'})
// Import the ORM to create functions that will interact with the database.
const orm = require("../config/orm.js");
const axios = require("axios");
const crypto = require('crypto');

function encrypt(text) {
    let hashed = crypto.createHash('sha256').update(text).digest('hex');
    return hashed;
}

const social = {
    selectFromUsers: (resolve) => {
        orm.selectData("userInfo", "id, userName, password, first_name, last_name", "", (res) => {
            resolve(res);
        });
    },
    selectUsersRestricted: (resolve) => {
        orm.selectData("userInfo", "id, userName", "", (res) => {
            resolve(res);
        });
    },
    userLoggedIn: (userID, resolve) => {
        orm.updateData("userInfo", "logged_in=true", `id=${userID}`, (res) => {
            resolve(res);
        });
    },
    userLoggedOut: (userID, resolve) => {
        orm.updateData("userInfo", "logged_in=false", `id=${userID}`, (res) => {
            resolve(res);
        });
    },
    selectPlaylists: (resolve) => {
        orm.selectData("playlist", "id, playlist_name", "", (res) => {
            resolve(res);
        });
    },
    selectUserPlaylists: (userID, resolve) => {
        orm.selectData("playlist", "id, playlist_name", `WHERE user_id=${userID}`, (res) => {
            resolve(res);
        });
    },
    // Requires playlist_name for WHERE condition. Shows all playlists that match the given search, along with genre, likes, description, and the user who created it
    selectPlaylistByID: (playlistID, resolve) => {
        orm.selectData("playlist p RIGHT JOIN userInfo u ON p.user_id = u.id", "p.createdAt, playlist_name, playlist_genre, playlist_description, likes, userName, p.user_id", `WHERE p.id=${playlistID}`, (res) => {
            resolve(res);
        });
    },
    // Requires playlist_genre for WHERE condition. Shows all playlists that match the given genre, along with the name of the playlist, likes, description, and the user who created it
    selectPlaylistByGenre: (playlistGenre, resolve) => {
        orm.selectData("playlist p RIGHT JOIN userInfo u ON p.user_id = u.id", "playlist_name, playlist_description, likes, userName", `WHERE playlist_genre="${playlistGenre}"`, (res) => {
            resolve(res);
        });
    },
    // Requires playlist_name for the WHERE condition
    selectPlaylistSongs: (playlistID, resolve) => {
        orm.selectData("playlistSongs s LEFT JOIN playlist p ON s.playlist_id = p.id", "s.id, song, artist", `WHERE p.id=${playlistID}`, (res) => {
            resolve(res);
        });
    },
    checkPass: (input, answer) => {
        let encrypted = encrypt(input + process.env.PW_SALT);
        return encrypted === answer;
    },
    // Gets all necessary information from the user to add to the database
    addNewUser: (userName, password, firstName, lastName, resolve) => {
        orm.selectData("userInfo", "id, userName", "", (res) => {
            if (!res.find(obj => obj.userName === userName)) {
                let pwEncrypt = encrypt(password + process.env.PW_SALT);
                orm.insertData("userInfo", "userName, password, first_name, last_name", `"${userName.toLowerCase()}", "${pwEncrypt}", "${firstName}", "${lastName}"`, (res) => {
                    resolve(res);
                });
            } else {
                console.log("Failed to add new user")
                resolve(res);
            }
        });
    },
    addPlaylistComment: (comment, userID, playlistID, resolve) => {
        orm.insertData("playlistComments", "commentContent, user_id, playlist_id", `"${comment}", "${userID}", "${playlistID}"`, (res) => {
            resolve(res);
        });
    },
    addOtherComment: (comment, userID, mbid, resolve) => {
        orm.insertData("otherComments", "commentContent, user_id, mbid", `"${comment}", "${userID}", "${mbid}"`, (res) => {
            resolve(res);
        });
    },
    addNewPlaylist: (playlistTitle, playlistGenre, playlistDescription, userID, resolve) => {
        orm.insertData("playlist", "playlist_name, playlist_genre, playlist_description, user_id", `"${playlistTitle}", "${playlistGenre}", "${playlistDescription}", "${userID}"`, (res) => {
            resolve(res);
        });
    },
    addSongToPlaylist: (songTitle, songArtist, mbid, playlistID, resolve) => {
        orm.insertData("playlistSongs", "song, artist, mbid, playlist_id", `"${songTitle}", "${songArtist}", "${mbid}", "${playlistID}"`, (res) => {
            resolve(res);
        });
    },
    removeSongInPlaylist: (songID, resolve) => {
        orm.removeData("playlistSongs", `WHERE id=${songID}`, (res) => {
            resolve(res);
        })
    },
    getAlbumInfo: async (artist, album) => {
        let response = await axios({
            url: `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.API}&artist=${artist}&album=${album}&format=json`,
            method: 'get'
        })
        return response.data;
    }
};

module.exports = social;