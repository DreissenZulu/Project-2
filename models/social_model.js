// Import the ORM to create functions that will interact with the database.
const orm = require("../config/orm.js");

const social = {
    let playlistSearch = await connection.query("SELECT playlist_genre, likes, userName FROM playlist p RIGHT JOIN userInfo u ON p.user_id = u.id WHERE playlist_name=?", response.playlistQuery);
    let playlistSongs = await connection.query("SELECT song FROM playlistSongs s LEFT JOIN playlist p ON s.playlist_id = p.id WHERE p.playlist_name=?", response.playlistQuery);
    let playlistSearch = await connection.query("SELECT playlist_name, likes, userName FROM playlist p RIGHT JOIN userInfo u ON p.user_id = u.id WHERE playlist_genre=?", response.genreName);
    let allCredentials = await connection.query("SELECT id, userName FROM userInfo");
    await connection.query(`UPDATE userInfo SET logged_in='no' WHERE id=${userOnServer.id}`);
    let allCredentials = await connection.query("SELECT id, userName, password, first_name, last_name FROM userInfo");
    await connection.query(`UPDATE userInfo SET logged_in='yes' WHERE id=${userOnServer.id}`);
    await connection.query("INSERT INTO userInfo (userName, password, first_name, last_name) VALUES (?)", [[response.loginID.toLowerCase(), pwEncrypt, response.firstName, response.lastName]]);
    let existingUsers = await connection.query("SELECT userName FROM userInfo");
    await connection.query("INSERT INTO playlistComments (commentContent, user_id, playlist_id) VALUES (?)", [[response.comment, currUser.id, playlistID]]);
    let playlists = await connection.query(`SELECT id, playlist_name FROM playlist`);
    await connection.query("INSERT INTO otherComments (commentContent, user_id, mbid) VALUES (?)", [[response.comment, currUser.id, response.mbid]]);
    await connection.query("INSERT INTO playlistSongs (mbid, song, playlist_id) VALUES (?)", [[response.mbid, response.songTitle, playlistID]]);
    let userPlaylists = await connection.query(`SELECT id, playlist_name FROM playlist WHERE user_id=${currUser.id}`);
    await connection.query("INSERT INTO playlist (playlist_name, playlist_genre, user_id) VALUES (?)", [[response.playlistTitle, response.playlistGenre, currUser.id]])


};

module.exports = social;