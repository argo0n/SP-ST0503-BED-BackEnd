/*
Name        LAI YE QI
Class       DIT/FT/1B/05
Group       ??
Admn        P2222189
 */

const db = require("./databaseConfig");


module.exports = {
    get_customer_payments: function (customer_id, start_date, end_date, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = `
                    SELECT
                        fi.title as title,
                        CONVERT(pm.amount, CHAR) as amount,
                        pm.payment_date as payment_date
                    FROM
                        payment pm
                            INNER JOIN rental rt ON rt.rental_id = pm.rental_id
                            INNER JOIN inventory i ON rt.inventory_id = i.inventory_id
                            INNER JOIN film fi ON i.film_id = fi.film_id
                    WHERE
                        DATE(rt.rental_date) >= ? AND DATE(rt.return_date) <= ? AND rt.customer_id = ?;
                `
                dbConn.query(sql, [start_date, end_date, customer_id], function (err, rental_results) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        const sql2 = `
                            SELECT 
                                CONVERT(COALESCE(SUM(pm.amount), 0), CHAR) AS total
                            FROM 
                                payment pm
                                INNER JOIN rental rt ON rt.rental_id = pm.rental_id
                                INNER JOIN inventory i ON rt.inventory_id = i.inventory_id
                                INNER JOIN film fi ON i.film_id = fi.film_id
                            WHERE
                                DATE(rt.rental_date) >= ? AND DATE(rt.return_date) <= ? AND rt.customer_id = ?;
                        `
                        dbConn.query(sql2, [start_date, end_date, customer_id], function(err, total_results) {
                            dbConn.end();
                            if (err) {
                                console.log(err);
                                return callback(err, null);
                            } else {
                                const all_results = {
                                    rental: rental_results,
                                    total: total_results[0].total
                                }
                                return callback(null, all_results);
                            }
                        })
                    }
                })
            }
        })
    },

    create_customer: function (customer, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const {store_id, first_name, last_name, email, address} = customer;
                const {address_line1, address_line2, district, city_id, postal_code, phone} = address;
                console.log(address)
                const address_sql = `
                    INSERT INTO address(address, address2, district, city_id, postal_code, phone)
                    VALUES (?, ?, ?, ?, ?, ?)`
                dbConn.query(address_sql, [address_line1, address_line2, district, city_id, postal_code, phone], function(add_err, add_result) {
                    if (add_err) {
                        console.log(add_err);
                        return callback(add_err, null);
                    } else {
                        const add_id = add_result.insertId
                        const cust_sql = `
                            INSERT IGNORE INTO customer(store_id, first_name, last_name, email, address_id) 
                            VALUES (?, ?, ?, ?, ?)`
                        dbConn.query(cust_sql, [store_id, first_name, last_name, email, add_id], function(cust_err, cust_result) {
                            if (cust_err) {
                                console.log(cust_err);
                                return callback(cust_err, null);
                            } else {
                                return callback(null, cust_result.insertId);

                            }
                        })
                    }
                })

            }
        })
    },

    get_city_via_name: function (city_name, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                // lower city_name and strip it of whitespace
                city_name = city_name.toLowerCase().trim();
                const sql = `
                SELECT * FROM city WHERE LOWER(city) = ? 
                `
                dbConn.query(cust_sql, )
            }
        })
    }
}