/*
Name        LAI YE QI
Class       DIT/FT/1B/05
Group       ??
Admn        P2222189
 */

const express = require("express");
const app = express();

const actor = require("../model/actor");
const customer = require("../model/customer");
const film_categories = require("../model/film_categories");
const staff = require("../model/staff");

const jwt = require("jsonwebtoken");
const JWT_SECRET  = require("../config.js");
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");

var cors = require("cors");

app.options('*', cors());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/login/', (req, res) => {
    staff.loginStaff(
      req.body.username,
      req.body.password,
      (error, staff_) => {
          if (error) {
              res.status(500).send();
          } else if (staff_ === null) {
              res.status(401).send();
          } else {
              const payload = { staff_id : staff_.id };
              jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
                  if (error) {
                      console.log(error);
                      res.status(401).send();
                  } else {
                      console.log(staff_);
                      res.status(200).json({
                          token: token,
                          staff_id: staff_.staff_id,
                      });
                  }
              })
          }
      })
})

// Endpoint 1: Get /actors/:actor_id
app.get("/actors/:actorID/", (req, res, next) => {
    // noinspection JSUnresolvedVariable
    const actorID = parseInt(req.params.actorID);
    // if actorID is not a number, send a 400
    if (isNaN(actorID)) {
        res.status(400).send();
        return;
    } else {
        actor.findByID(actorID, (err, actor) => {
            if (err) {
                res.status(500).json({error_msg: "Internal server error"});
            } else if (actor === null) {
                res.sendStatus(204);
            } else {
                res.status(200).json({
                    actor_id: actor.actor_id,
                    first_name: actor.first_name,
                    last_name: actor.last_name
                });
            }
        })
    }
})


// Endpoint 2: GET /actors
app.get("/actors", (req, res) => {
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    if (isNaN(limit)) {
        limit = 20;
    }
    if (isNaN(offset)) {
        offset = 0;
    }
    actor.getActors(limit, offset, function (err, result) {
        if (!err) {
            res.status(200).json(result)
        } else {
            res.status(500).json({error_msg: "Internal server error"})
        }
    })
})

app.post("/actors", (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    if (first_name == null || last_name == null) {
        res.status(400).json({error_msg: "missing data"})
    } else {
        actor.insert(req.body, function (err, result) {
            if (!err) {
                res.status(201).json({actor_id: result})
            } else {
                res.status(500).json({error_msg: "Internal server error"});
            }
        })
    }
})

app.put("/actors/:actor_id", (req, res) => {
    const actor_id = parseInt(req.params.actor_id);
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    if (first_name == null && last_name == null) {
        res.status(400).json({error_msg: "missing data"});
    } else {
        actor.update(actor_id, first_name, last_name, function (err, result) {
            if (!err) {
                if (result == 0) {
                    res.sendStatus(204);
                } else {
                    res.status(200).json({success_msg: "record updated"})
                }
            } else {
                res.status(500).json({error_msg: "Internal server error"});
            }
        })
    }
})

app.delete("/actors/:actor_id", (req, res) => {
    const actor_id = parseInt(req.params.actor_id);
    actor.delete(actor_id, function (err, result) {
        if (!err) {
            if (result < 1) {
                res.sendStatus(204);
            } else {
                res.status(200).json({success_msg: "actor deleted"});
            }
        } else {
            res.status(500).json({error_msg: "Internal server error"});
        }
    })
})

app.get("/film_categories/:category_id/films", (req, res) => {
    const category_id = parseInt(req.params.category_id);
    film_categories.films_by_category(category_id, function (err, result) {
        if (!err) {
            res.status(200).json(result);
        } else {
            res.status(500).json({error_msg: "Internal server error"});
        }
    })
})

app.get("/customer/:customer_id/payment", (req, res) => {
    const customer_id = parseInt(req.params.customer_id);
    customer.get_customer_payments(customer_id, req.query.start_date, req.query.end_date, function(err, result) {
        if (!err) {
            res.status(200).json(result);
        } else {
            res.status(500).json({error_msg: "Internal server error"});
        }
    })
})

app.post("/customers", (req, res) => {
    if (req.body.store_id == null || req.body.first_name == null ||
        req.body.last_name == null || req.body.email == null ||
        req.body.address.address_line1 == null || req.body.address.address_line2 == null ||
        req.body.address.district == null || req.body.address.city_id == null ||
        req.body.address.postal_code == null || req.body.address.phone == null
    ) {
        res.status(400).json({error_msg: "missing data"});
    } else {
        customer.create_customer(req.body, function(err, result) {
            if (!err) {
                if (result == 0) {
                    res.status(409).json({error_msg: "email already exist"});
                } else {
                    res.status(201).json({customer_id: result});
                }
            } else {
                res.status(500).json({error_msg: "Internal server error"});
            }
        })
    }
})

module.exports = app;