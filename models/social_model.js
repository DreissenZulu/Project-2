// Import the ORM to create functions that will interact with the database.
const orm = require("../config/orm.js");

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
    // Requires playlist_name for WHERE condition. Shows all playlists that match the given search, along with genre, likes, and the user who created it
    selectPlaylistByName: (playlistName, resolve) => {
        orm.selectData("playlist p RIGHT JOIN userInfo u ON p.user_id = u.id", "playlist_genre, likes, userName", `WHERE playlist_name="${playlistName}"`, (res) => {
            resolve(res);
        });
    },
    // Requires playlist_genre for WHERE condition. Shows all playlists that match the given genre, along with the name of the playlist, likes, and the user who created it
    selectPlaylistByGenre: (playlistGenre, resolve) => {
        orm.selectData("playlist p RIGHT JOIN userInfo u ON p.user_id = u.id", "playlist_name, likes, userName", `WHERE playlist_genre="${playlistGenre}"`, (res) => {
            resolve(res);
        });
    },
    // Requires playlist_name for the WHERE condition
    selectPlaylistSongs: (playlistName, resolve) => {
        orm.selectData("playlistSongs s LEFT JOIN playlist p ON s.playlist_id = p.id", "song", `WHERE playlist_name="${playlistName}"`, (res) => {
            resolve(res);
        });
    }

    
    await connection.query(`UPDATE userInfo SET logged_in='no' WHERE id=${userOnServer.id}`);
    await connection.query(`UPDATE userInfo SET logged_in='yes' WHERE id=${userOnServer.id}`);
    await connection.query("INSERT INTO userInfo (userName, password, first_name, last_name) VALUES (?)", [[response.loginID.toLowerCase(), pwEncrypt, response.firstName, response.lastName]]);
    await connection.query("INSERT INTO playlistComments (commentContent, user_id, playlist_id) VALUES (?)", [[response.comment, currUser.id, playlistID]]);
    await connection.query("INSERT INTO otherComments (commentContent, user_id, mbid) VALUES (?)", [[response.comment, currUser.id, response.mbid]]);
    await connection.query("INSERT INTO playlistSongs (mbid, song, playlist_id) VALUES (?)", [[response.mbid, response.songTitle, playlistID]]);
    await connection.query("INSERT INTO playlist (playlist_name, playlist_genre, user_id) VALUES (?)", [[response.playlistTitle, response.playlistGenre, currUser.id]])


};

module.exports = social;