const mysql = require('mysql2');
require('dotenv').config();

const conf = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const connection = mysql.createConnection(conf);

connection.connect(function(err) {
    if (err) throw err;
    console.log('[DB] connected');
});

module.exports = connection;
