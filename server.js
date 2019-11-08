require('dotenv').config()
const express = require('express');
const LastFM = require('last-fm');
const mysql = require('mysql');
const inquirer = require('inquirer');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// This needs to go into the frontend
let currUser = {
    userName: "",
    firstName: "",
    lastName: ""
};
// if (localStorage.getItem("currentUser")) {
//     currUser = JSON.parse(localStorage.getItem("currentUser"))
// } else {
//     currUser = [];
// }

const lastfm = new LastFM(process.env.API);

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

const db = new Database({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "socialAppDB"
});

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

function encrypt(text) {
    let hashed = crypto.createHash('sha256').update(text).digest('hex');
    return hashed;
}

async function confirmNewUserName(input) {
    let regex = new RegExp(/\s/g)
    let existingUsers = await db.query("SELECT userName FROM userInfo");
    if (!regex.test(input)) {
        if (!existingUsers.find(obj => obj.userName === input.toLowerCase())) {
            return true;
        }
        return "This user exists. Please enter a new username"
    }
        return "Invalid username. Enter a user without spaces."
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
    ]).then(async function(response) {
        let pwEncrypt = encrypt(response.password+process.env.PW_SALT);
        console.log(pwEncrypt);
        await db.query("INSERT INTO userInfo (userName, password, first_name, last_name) VALUES (?)", [[response.loginID.toLowerCase(), pwEncrypt, response.firstName, response.lastName]]);
        testApp();
    })
}

async function loginAccount() {
    inquirer.prompt([
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
    ]).then(async function (response) {
        let allCredentials = await db.query("SELECT id, userName, password, first_name, last_name FROM userInfo");
        let userOnServer = allCredentials.find(obj => obj.userName === response.loginID)
        if (userOnServer != undefined) {
            if (userOnServer.password == encrypt(response.password+process.env.PW_SALT)) {
                console.log(`Hello there ${userOnServer.first_name}!`)
                await db.query(`UPDATE userInfo SET logged_in='yes' WHERE id=${userOnServer.id}`);
                currUser.userName = userOnServer.userName;
                currUser.firstName = userOnServer.first_name;
                currUser.lastName = userOnServer.last_name;
                testUserOptions();
            } else {
                console.log(`Invalid password!!`);
            }
        } else {
            console.log(`Invalid username!`);
        }
    })
}

async function clearToken() {
    let allCredentials = await db.query("SELECT id, userName FROM userInfo");
    let userOnServer = allCredentials.find(obj => obj.userName === currUser.userName)
    await db.query(`UPDATE userInfo SET logged_in='no' WHERE id=${userOnServer.id}`);
    currUser.userName = "";
    currUser.firstName = "";
    currUser.lastName = "";
    testApp();
}

function searchPlaylistGenre(genreName) {

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
                "Search for something"
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
            case "Search for something":
                break;
        }
    })
}

function testUserOptions() {
    inquirer.prompt([
        {
            name: "usermenu",
            type: "list",
            message: `What would you like to do, ${currUser.firstName}?`,
            choices: [
                "Search for something",
                "Log out"
            ]
        }
    ]).then(choice => {
        switch (choice.usermenu) {
            case "Search for something":
                break;
            case "Log out":
                clearToken();
                break;
        }

    })
}

app.listen(port, () => {
    console.log(`Now listening to port ${port}. Enjoy your stay!`);
    testApp();
})