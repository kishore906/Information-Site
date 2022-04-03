const express = require("express");
const mysql = require("mysql");
const authController = require("../controllers/auth");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
  res.render("index", {
    user: req.user,
  });
});

router.get("/registration", (req, res) => {
  res.render("registration");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/webdevelopment", authController.isLoggedIn, (req, res) => {
  res.render("webdevelopment", {
    user: req.user,
  });
});

router.get("/DataScience", authController.isLoggedIn, (req, res) => {
  res.render("DataScience", {
    user: req.user,
  });
});

router.get("/cloudcomputing", authController.isLoggedIn, (req, res) => {
  res.render("cloudcomputing", {
    user: req.user,
  });
});

router.get("/changepassword", (req, res) => {
  res.render("changepassword");
});

router.get("/search_colleges", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("search_colleges", {
      user: req.user,
    });
  } else {
    res.redirect("/registration");
  }
});

router.post("/collegeinfo", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    const username = req.user.email;
    const id = req.body.id;
    console.log(id);
    db.query(
      "SELECT * FROM colleges WHERE college_id = ?",
      [id],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        //res.render("addlist", { collegeData: result[0] });

        console.log(result[0]);

        const data = [
          [
            username,
            result[0].college_name,
            result[0].college_field,
            result[0].college_city,
            result[0].college_state,
            result[0].college_address,
          ],
        ];

        const query1 =
          "SELECT college_name, college_address FROM wishlist WHERE college_name = ? AND college_address = ?";
        db.query(
          query1,
          [result[0].college_name, result[0].college_address],
          (error, results) => {
            if (error) {
              console.log(error);
            }

            if (results.length > 0) {
              return res.render("search_colleges", {
                message: "College Already Saved",
              });
            }

            const sql =
              "INSERT INTO wishlist (username, college_name, college_field, college_city, college_state, college_address) VALUES ?";

            db.query(sql, [data], (error, result) => {
              if (error) {
                console.log(error);
              }
              res.render("search_colleges", {
                message: "College Saved To WishList",
              });
            });
          }
        );
      }
    );
  }
});

router.get("/addlist", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    db.query(
      "SELECT * FROM wishlist WHERE username = ?",
      [req.user.email],
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          res.render("addlist", { listData: result });
        }
      }
    );
  }
});

router.get("/addlist/:id", (req, res) => {
  const delete_id = req.params.id;
  console.log(delete_id);
  db.query(
    "DELETE FROM wishlist WHERE id = ?",
    [delete_id],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.redirect("/addlist");
    }
  );
});

module.exports = router;
