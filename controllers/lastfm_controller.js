const express = require("express");
// Import the burger module to access database functions
const social = require("../models/social_model.js");

// The router is like using app = express(), where the server is defined in another file
let router = express.Router();

module.exports = router;