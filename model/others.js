/*
Name        LAI YE QI
Class       DIT/FT/1B/05
Group       ??
Admn        P2222189
 */

const db = require("./databaseConfig");

module.exports = {
  getCities: function(callback) {
    var dbConn = db.getConnection();
    dbConn.connect(function(err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        const query = `
            SELECT 
                ci.city_id, ci.city, co.country
            FROM 
                city ci
            INNER JOIN country co ON ci.country_id = co.country_id
            `
        dbConn.query(query, (error, results) => {
          if (error) {
            return callback(error, null);
          } else {
            return callback(null, results)

          }
        })
      }
    })
  }
}