require('dotenv').config()
const express = require('express');
const inquirer = require('inquirer');
const social = require("./models/social_model.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// This needs to go into the frontend
let currUser = {
    id: "",
    userName: "",
    firstName: "",
    lastName: ""
};
// if (localStorage.getItem("currentUser")) {
//     currUser = JSON.parse(localStorage.getItem("currentUser"))
// } else {
//     currUser = [];
// }

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
            testUserOptions();
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
        testUserOptions();
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
        testUserOptions();
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
        testUserOptions();
    })
}



async function confirmNewUserName(input) {
    let regex = new RegExp(/\s/g)
    social.selectUsersRestricted(async function (result) {
        if (!regex.test(input)) {
            if (!result.find(obj => obj.userName === input.toLowerCase())) {
                console.log("Reached!")
                return true;
            }
            return "This user exists. Please enter a new username"
        }
        return "Invalid username. Enter a user without spaces."
    });
};

async function confirmDataEntered(input) {
    if (input.trim() != "") {
        return true;
    }
    return "This field cannot be blank!";
}

function createAccount() {
    inquirer.prompt([
        {
            name: "loginID",
            type: "input",
            message: "Enter your new login ID",
            validate: confirmNewUserName
        },
        {
            name: "password",
            type: "password",
            mask: '*',
            message: "Enter your password",
            validate: confirmDataEntered
        },
        {
            name: "firstName",
            type: "input",
            message: "Enter your first name",
            validate: confirmDataEntered
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter your last name (optional)"
        }
    ]).then(async function (response) {
        social.addNewUser(response.loginID.toLowerCase(), response.password, response.firstName, response.lastName, result => {
            console.log(result);
        })
        testApp();
    })
}

async function checkLogin(response) {
    social.selectFromUsers(async function (result) {
        let allCredentials = await result;
        console.log(allCredentials);
        let userOnServer = allCredentials.find(obj => obj.userName === response.loginID)
        if (userOnServer != undefined) {
            console.log(`Authenticating...`);
            setTimeout(async function () {
                console.log(userOnServer.password);
                if (social.checkPass(response.password, userOnServer.password)) {
                    console.log(`Hello there ${userOnServer.first_name}!`)
                    social.userLoggedIn(userOnServer.id, result => {
                        console.log(result);
                    });
                    currUser.id = userOnServer.id;
                    currUser.userName = userOnServer.userName;
                    currUser.firstName = userOnServer.first_name;
                    currUser.lastName = userOnServer.last_name;
                    testUserOptions();
                } else {
                    console.log(`Invalid password!!`);
                }
            }, 1500);
        } else {
            console.log(`Invalid username!`);
        }
    })
}

async function loginAccount() {
    let responses = await inquirer.prompt([
        {
            name: "loginID",
            type: "input",
            message: "Enter your login ID",
            validate: confirmDataEntered
        },
        {
            name: "password",
            type: "password",
            mask: '*',
            message: "Enter your password",
            validate: confirmDataEntered
        }
    ])
    checkLogin(responses);
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
    testApp();
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
        if (currUser.id != "") {
            testUserOptions();
        } else {
            testApp();
        }
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
        if (currUser.id != "") {
            testUserOptions();
        } else {
            testApp();
        }
    })
}

function testApp() {
    inquirer.prompt([
        {
            name: "mainmenu",
            type: "list",
            message: "Choose your action",
            choices: [
                "Create new account",
                "Log into account",
                "Search for playlist",
                "Search by genre"
            ]
        }
    ]).then(choice => {
        switch (choice.mainmenu) {
            case "Create new account":
                createAccount();
                break;
            case "Log into account":
                loginAccount();
                break;
            case "Search for playlist":
                searchPlaylists();
                break;
            case "Search by genre":
                searchPlaylistGenre();
                break;
        }
    })
};

function testUserOptions() {
    inquirer.prompt([
        {
            name: "usermenu",
            type: "list",
            message: `What would you like to do, ${currUser.firstName}?`,
            choices: [
                "Search for playlist",
                "Search by genre",
                "Create playlist",
                "Add to playlist",
                "Comment on playlist",
                "Log out"
            ]
        }
    ]).then(choice => {
        switch (choice.usermenu) {
            case "Search for album":
                searchAlbum();
                break;
            case "Search for playlist":
                searchPlaylists();
                break;
            case "Search by genre":
                searchPlaylistGenre();
                break;
            case "Create playlist":
                createPlaylist();
                break;
            case "Add to playlist":
                devTestAddToPlaylist();
                break;
            case "Comment on playlist":
                commentOnPlaylist();
                break;
            case "Log out":
                clearToken();
                break;
        }
    })
};

// Import routes and give the server access to them.
var routes = require("./controllers/lastfm_controller.js");

app.use(routes);

app.listen(port, () => {
    console.log(`Now listening to port ${port}. Enjoy your stay!`);
});

testApp();