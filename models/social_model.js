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
    // Search for playlists and return anything that is similar to the name of the playlist or the genre of the playlist
    searchPlaylists: (query, resolve) => {
        orm.selectData("playlist", "id, playlist_name, playlist_genre", `WHERE playlist_name LIKE '%${query}%' OR playlist_genre LIKE '%${query}%'`, (res) => {
            resolve(res);
        });
    },
    selectUserPlaylists: (userID, resolve) => {
        orm.selectData("playlist", "id, playlist_name", `WHERE user_id=${userID}`, (res) => {
            resolve(res);
        });
    },
    // Gets the playlists the user likes
    selectFavouritePlaylists: (userID, resolve) => {
        orm.selectData("playlist p RIGHT JOIN favPlaylists f ON p.id = f.playlist_id", "p.id, playlist_name, fav_status", `WHERE likedByID=${userID}`, (res) => {
            resolve(res);
        });
    },
    updateFavStatus: (userID, playlistID, updateVal, resolve) => {
        orm.updateData("favPlaylists", `fav_status=${updateVal}`, `likedByID=${userID} AND playlist_id=${playlistID}`, (res) => {
            resolve(res);
        })
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
    selectPlaylistComments: (playlistID, resolve) => {
        orm.selectData("playlistComments p LEFT JOIN userInfo u ON p.user_id = u.id", "commentContent, playlist_id, p.createdAt, userName", `WHERE playlist_id=${playlistID}`, (res) => {
            resolve(res);
        })
    },
    checkPass: (input, answer) => {
        let encrypted = encrypt(input + process.env.PW_SALT);
        return encrypted === answer;
    },
    // Gets all necessary information from the user to add to the database
    addNewUser: (userName, password, firstName, lastName, resolve) => {
        orm.selectData("userInfo", "id, userName", "", (res) => {
            if (!res.find(obj => obj.userName.toLowerCase() === userName.toLowerCase())) {
                let pwEncrypt = encrypt(password + process.env.PW_SALT);
                orm.insertData("userInfo", "userName, password, first_name, last_name", `"${userName}", "${pwEncrypt}", "${encodeURIComponent(firstName)}", "${encodeURIComponent(lastName)}"`, (res) => {
                    resolve(res);
                });
            } else {
                resolve("failed");
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
    addFavouritePlaylist: (userID, playlistID, resolve) => {
        orm.insertData("favPlaylists", "likedByID, playlist_id", `"${userID}", "${playlistID}"`, (res) => {
            resolve(res);
        })
    },
    addSongToPlaylist: (songTitle, songArtist, playlistID, resolve) => {
        orm.insertData("playlistSongs", "song, artist, playlist_id", `"${songTitle}", "${songArtist}", "${playlistID}"`, (res) => {
            resolve(res);
        });
    },
    removeSongInPlaylist: (songID, resolve) => {
        orm.removeData("playlistSongs", `WHERE id=${songID}`, (res) => {
            resolve(res);
        })
    },
    removeFavouritePlaylist: (playlistID, userID, resolve) => {
        orm.removeData("favPlaylists", `WHERE likedByID=${userID} AND playlist_id${playlistID}`, (res) => {
            resolve(res);
        })
    },
    // External API calls
    getAlbumInfo: async (artist, album) => {
        let response = await axios({
            url: `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.API}&artist=${artist}&album=${album}&format=json`,
            method: 'get'
        })
        return response.data;
    },
    getTrackInfo: async (artist, song) => {
        let response = await axios({
            url: `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${process.env.API}&artist=${artist}&track=${song}&format=json`,
            method: 'get'
        })
        return response.data;
    },
    getYouTubeLink: async (artist, song) => {
        let response = await axios({
            url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${song} ${artist}&key=${process.env.ytAPI}`,
            method: 'get'
        })
        return response.data.items[0];
    }
};

module.exports = social;