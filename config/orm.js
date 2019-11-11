// Import MySQL connection.
const connection = require("./connection.js");

// Put functions that interact with the server directly here.
const orm = {
    selectData: (tables, columns, condition, resolve) => {
        let queryString = `SELECT ${columns} FROM ${tables} ${condition};`;
        await connection.query(queryString, function (err, res) {
            if (err) throw err;
            resolve(res);
        });
    },
    insertData: (table, columns, vals, resolve) => {
        let queryString = `INSERT INTO ${table} (${columns}) VALUES (${vals});`;
        await connection.query(queryString, function (err, res) {
            if (err) throw err;
            resolve(res);
        });
    },
    updateData: (table, updateVal, condition, resolve) => {
        let queryString = `UPDATE ${table} SET ${updateVal} WHERE ${condition};`;
        await connection.query(queryString, function (err, res) {
            if (err) throw err;
            resolve(res);
        });
    }
};

module.exports = orm;