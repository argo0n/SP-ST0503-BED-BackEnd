/*
Name        LAI YE QI
Class       DIT/FT/1B/05
Group       ??
Admn        P2222189
 */

const db = require("./databaseConfig");


module.exports = {
    films_by_category: function (category_id, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = `
                    SELECT
                        fi.film_id, fi.title, ca.name, fi.rating, fi.release_year, fi.length as duration
                    FROM
                        film fi
                            INNER JOIN film_category fica ON fi.film_id = fica.film_id
                            INNER JOIN category ca on fica.category_id = ca.category_id
                    WHERE
                        ca.name = ?
                `
                dbConn.query(sql, [category_id], function (err, results) {
                    dbConn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                })
            }
        })
    }
}