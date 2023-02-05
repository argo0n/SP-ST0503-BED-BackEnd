/*
Name        LAI YE QI
Class       DIT/FT/1B/05
Group       ??
Admn        P2222189
 */

const db = require("./databaseConfig");


module.exports = {

    createFilm: function(film, callback) {
        var dbConn = db.getConnection();
        const { title, description, release_year, language_id, category_id, length, rating, actors, image } = film;
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = `
                    INSERT INTO film (title, description, release_year, language_id, length, rating, image) VALUES (?, ?, ?, ?, ?, ?, ?)
                `
                dbConn.query(sql, [title, description, release_year, language_id, length, rating, image], function(err, results) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        const insertID = results.insertId;
                        const actors_sql = "INSERT INTO film_actor(actor_id, film_id) VALUES (?, ?)"
                        for (let i = 0; i < actors.length; i++) {
                            dbConn.query(actors_sql, [actors[i], insertID], function(err, results) {
                                if (err) {
                                    console.log(err);
                                    return callback(err, null);
                                }
                            })
                        }
                        var film_category_sql = `INSERT into film_category (film_id, category_id) VALUES (?, ?)`
                        dbConn.query(film_category_sql, [insertID, category_id], function(err, results) {
                            if (err) {
                                console.log(err);
                                return callback(err, null);
                            } else {
                                dbConn.end();
                                return callback(null, insertID);
                            }
                        })
                    }
                })
            }
        })
    },


    films_by_category: function (category_id, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = `
                    SELECT
                        fi.film_id, fi.title, ca.name as category, fi.description, fi.release_year, la.name as language, fi.length, fi.rating, fi.special_features, fi.rental_rate
                    FROM film fi
                         INNER JOIN film_category fica on fi.film_id = fica.film_id
                         INNER JOIN category ca on fica.category_id = ca.category_id
                         INNER JOIN language la on fi.language_id = la.language_id
                    WHERE 
                        fica.category_id = ?
                `
                dbConn.query(sql, [category_id], function (err, results) {
                    dbConn.end();
                    console.log(results)
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                })
            }
        })
    },

    get_languages: function(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                let sql = `SELECT language_id, name FROM language`
                dbConn.query(sql, function(err, results) {
                    dbConn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                })
            }
        })
    },

    films_by_title: function (title, max_price, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                let sql = `
                SELECT 
                    fi.film_id, fi.title, ca.name as category, fi.description, fi.release_year, la.name as language, fi.length, fi.rating, fi.special_features, fi.rental_rate
                FROM 
                    film fi
                INNER JOIN film_category fica on fi.film_id = fica.film_id
                INNER JOIN category ca on fica.category_id = ca.category_id
                INNER JOIN language la on fi.language_id = la.language_id
                WHERE 
                    fi.title like ?
                `
                if (!isNaN(max_price) && max_price > 0) {
                    sql += " AND fi.rental_rate < ?"
                }
                let param = `%${title}%`
                dbConn.query(sql, [param, max_price], function(err, results) {
                    dbConn.end();
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, results);
                    }
                })

            }
        })
    },

    film_by_id: function (id, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = `
                SELECT 
                fi.film_id, fi.title, ca.name as category, fi.description, fi.release_year, la.name as language, fi.length, fi.rating, fi.special_features, fi.rental_rate, fi.image
                FROM film fi
                INNER JOIN film_category fica on fi.film_id = fica.film_id
                INNER JOIN category ca on fica.category_id = ca.category_id
                INNER JOIN language la on fi.language_id = la.language_id
                WHERE fi.film_id = ?
                `

                dbConn.query(sql, [id], function(err, results) {
                    if (err) {
                        dbConn.end();
                        return callback(err, null);
                    } else {
                        console.log(results[0].image, typeof(results[0].image))
                        if (results.length === 0) {
                            dbConn.end();
                            return callback(null, null);
                        } else {
                            var film = results[0]
                            var actor_sql = `
                    SELECT ac.first_name, ac.last_name, fi.title 
                    FROM actor ac
                    INNER JOIN film_actor fa on ac.actor_id = fa.actor_id
                    INNER JOIN film fi on fa.film_id = fi.film_id
                    `
                            dbConn.query(actor_sql, function(err, actor_results) {
                                dbConn.end();
                                if (err) {
                                    return callback(err, null);
                                } else {
                                    film.actors = [];
                                    for (var j = 0; j < actor_results.length; j++) {
                                        var actor = actor_results[j];
                                        if (actor.title === film.title) {
                                            film.actors.push(`${actor.first_name} ${actor.last_name}`);
                                        }
                                    }
                                    return callback(null, film);
                                    }
                                })
                        }
                    }
                })
            }
        })
    },

    film_categories: function(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const sql = `
                SELECT 
                category_id, name
                FROM category
                `
                dbConn.query(sql, function(err, results) {
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