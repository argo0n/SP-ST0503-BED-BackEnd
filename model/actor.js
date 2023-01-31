/*
Name        LAI YE QI
Class       DIT/FT/1B/05
Group       ??
Admn        P2222189
 */

const db = require("./databaseConfig");

module.exports = {
    findByID: function(actorID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const findActorByIDQuery = "SELECT * FROM actor WHERE actor_id = ?;";
                dbConn.query(findActorByIDQuery, [actorID], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    } else if (results.length === 0) {
                        return callback(null, null);
                    } else {
                        return callback(null, results[0]);
                    }
                });
            }
        });
    },

    getActors: function(limit, offset, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                var sql = "SELECT actor_id, first_name, last_name FROM actor LIMIT ?,?;"
                dbConn.query(sql, [offset, limit], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                })

            }
        })
    },

    insert: function(actor, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const {first_name, last_name} = actor;
                var sql = "INSERT INTO actor (first_name, last_name) VALUES(?, ?);"
                dbConn.query(sql, [first_name, last_name], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result.insertId);
                    }
                })

            }
        })
    },

    update: function(actor_id, first_name, last_name, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                dbConn.query("SELECT first_name, last_name FROM actor WHERE actor_id = ?", [actor_id], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        if (result.length === 0) {
                            return callback(null, 0);
                        } else {
                            if (first_name == null) {
                                first_name = result[0].first_name;
                            }
                            if (last_name == null) {
                                last_name = result[0].last_name;
                            }
                            var sql = "UPDATE actor SET first_name = ?, last_name = ? WHERE actor_id = ?";
                            var args = [first_name, last_name, actor_id];
                            dbConn.query(sql, args, function (err, result) {
                                dbConn.end();
                                if (err) {
                                    console.log(err);
                                    return callback(err, null);
                                } else {
                                    return callback(null, 1);
                                }
                            })
                        }
                    }
                })
            }
        })
    },

    delete: function(actor_id, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                sql = "DELETE FROM actor WHERE actor_id = ?"
                dbConn.query(sql, [actor_id], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result.affectedRows);
                    }
                })
            }
        })
    }


}