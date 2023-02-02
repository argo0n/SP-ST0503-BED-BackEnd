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
  },

  getStaffbyID: function(staff_id, callback) {
    var dbConn = db.getConnection();
    dbConn.connect(function(err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
      const query = "SELECT * FROM staff WHERE staff_id = ?";
      dbConn.query(query, [staff_id], (error, results) => {
        if (error) {
          return callback(error, null);
        } else if (results.length === 0) {
          return callback(null, null);
        } else {
          const staff = results[0];
          return callback(null, staff);
        }
      })}
      }
    )
  },

  getStores: function(callback) {
    var dbConn = db.getConnection();
    dbConn.connect(function(err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        const query = `
            SELECT 
                st.store_id, ad.address, ad.address2, ad.district, ct.city, ad.postal_code, sta.first_name, sta.last_name
            FROM 
                address ad
            INNER JOIN city ct on ad.city_id = ct.city_id
            INNER JOIN store st on ad.address_id = st.address_id
            INNER JOIN staff sta ON sta.staff_id = st.manager_staff_id
            `
        dbConn.query(query, (error, results) => {
          if (error) {
            return callback(error, null);
          } else {
            var returning_data = []
            for (var i = 0; i < results.length; i++) {
              var store = results[i];
              var fullAddress = store.address2 ? `${store.address}, ${store.address2}` : store.address;
              fullAddress += `, ${store.district}, ${store.city}, ${store.postal_code || ""}`
              manager_name = `${store.first_name} ${store.last_name}`

              var new_store = {
                store_id: store.store_id,
                address: fullAddress,
                manager: manager_name
              }
              returning_data.push(new_store);
            }
            return callback(null, returning_data)

          }
        })
      }
    })
  }
}