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

async function confirmNewUserName(input) {
    let regex = new RegExp(/\s/g)
    let existingUsers = await db.query("SELECT userName FROM userInfo");
    if (!regex.test(input)) {
        if (!existingUsers.find(obj => obj.userName === input)) {
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
        let pwEncrypt = await db.query(`SELECT SHA2("${response.password+process.env.PW_SALT}", 128)`);
        console.log(pwEncrypt[0].key);
        await db.query("INSERT INTO userInfo (userName, password, first_name, last_name) VALUES (?)", [[response.loginID, pwEncrypt, response.firstName, response.lastName]]);
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
    ]).then(response => {
        let allCredentials = db.query("SELECT userName, password, first_name, last_name FROM ")
    })
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
                break;
            case "Search for something":
                break;
        }
    })
}

app.listen(port, () => {
    console.log(`Now listening to port ${port}. Enjoy your stay!`);
    testApp();
})