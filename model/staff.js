/*
Name        LAI YE QI
Class       DIT/FT/1B/05
Group       ??
Admn        P2222189
 */

const db = require("./databaseConfig");

module.exports = {
  loginStaff: function(username, password, callback) {
    var dbConn = db.getConnection();
    dbConn.connect(function(err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        const query = "SELECT * FROM staff WHERE username = ? AND password = ? AND active = true";
        dbConn.query(query, [username, password], (error, results) => {
          if (error) {
            return callback(error, null);
          } else if (results.length === 0) {
            return callback(null, null);
          } else {
            const user = results[0]
            return callback(null, user);
          }
        })

      }
    })
  }
}