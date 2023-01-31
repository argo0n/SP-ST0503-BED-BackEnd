/*
Name        LAI YE QI
Class       DIT/FT/1B/05
Group       ??
Admn        P2222189
 */

const mysql = require("mysql");

var dbconnect = {
    getConnection: function() {
        var conn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'bed_dvd_root',
            password: 'pa$$woRD123',
            database: 'bed_dvd_db',
            dateStrings: true
        });

        return conn;
    }
}

module.exports = dbconnect;