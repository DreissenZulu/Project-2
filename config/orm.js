// Import MySQL connection.
const connection = require("./connection.js");

// Put functions that interact with the server directly here.
const orm = {
    selectData: (columns, tables, condition, resolve) => {
        let queryString = `SELECT ${columns} FROM ${tables} ${condition};`;
        connection.query(queryString, function (err, res) {
            if (err) throw err;
            resolve(res);
        });
    },
    insertData: (table, cols, vals, resolve) => {
        let queryString = `INSERT INTO ${table} (${cols}) VALUES (${vals});`;
        connection.query(queryString, function (err, res) {
            if (err) throw err;
            resolve(res);
        });
    },
    updateData: (table, updateVal, condition, resolve) => {
        let queryString = `UPDATE ${table} SET ${updateVal} WHERE ${condition};`;
        connection.query(queryString, function (err, res) {
            if (err) throw err;
            resolve(res);
        });
    }
};

module.exports = orm;