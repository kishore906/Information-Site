const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.registration = (req, res) => {
  console.log(req.body);

  const { firstname, surname, email, password, passwordConfirm } = req.body;

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        return res.render("registration", {
          message: "This email is already registered",
        });
      } else if (password !== passwordConfirm) {
        return res.render("registration", {
          message: "Password donot match",
        });
      }

      //Password Hashing

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      //INSERTING VALUES INTO DATABASE

      db.query(
        "INSERT INTO users SET ?",
        {
          firstname: firstname,
          surname: surname,
          email: email,
          password: hashedPassword,
        },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            return res.render("registration", {
              message: "Registered Successfuly Click Login to Continue..",
            });
          }
        }
      );
    }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        message: "please provide email and password",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).render("login", {
            message: "Email or Password is incorrect",
          });
        } else {
          const id = results[0].id;

          //CREATING TOKENS FOR EACH USER

          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          console.log("The token is: " + token);

          //SETTINGUP TOKEN INTO COOKIE

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

          //SETTINGUP COOKIE IN THE BROWSER

          res.cookie("jwt", token, cookieOptions);
          res.status(200).redirect("/");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.changePassword = async (req, res) => {
  const { email, password, newpassword } = req.body;

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length === 0) {
        return res.render("changepassword", {
          message: "Email not Registered",
        });
      } else if (password !== newpassword) {
        return res.render("changepassword", { message: "Password mismatch" });
      } else {
        //Password Hashing

        let hashedPassword = await bcrypt.hash(newpassword, 8);
        console.log(hashedPassword);

        //UPDATING VALUES INTO DATABASE

        db.query(
          "UPDATE users SET password = ? WHERE email = ?",
          [hashedPassword, email],
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log(results);
              return res.render("changepassword", {
                message:
                  "Password Updated Succesfully Click Login to Continue..",
              });
            }
          }
        );
      }
    }
  );
};

exports.isLoggedIn = async (req, res, next) => {
  // consoe.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      //Verifying the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      console.log(decoded);

      //checks user still exists

      db.query(
        "SELECT * FROM users WHERE id= ?",
        [decoded.id],
        (error, result) => {
          console.log(result);

          if (!result) {
            return next();
          }

          req.user = result[0];
          return next();
        }
      );
    } catch (error) {
      return next();
    }
  } else {
    return next();
    //res.redirect("/login");
  }
};

exports.logout = async (req, res) => {
  //Creating a New Cookie which overides the existing cookie in the browser
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });

  res.status(200).redirect("/");
};

exports.search_colleges = (req, res) => {
  console.log(req.body);

  const { college_field, college_state } = req.body;

  db.query(
    "SELECT * FROM colleges WHERE college_field = ? AND college_state = ?",
    [college_field, college_state],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.render("search_colleges", { data: result });
    }
  );
};

//College data displaying
exports.collegeInfo = (req, res) => {
  const id = req.params.id;
  console.log(id);
  db.query(
    "SELECT * FROM colleges WHERE college_id = ?",
    [id],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      console.log(result[0]);
      res.render("collegeinfo", { collegeData: result[0] });
    }
  );
};

/*
exports.collegeAddList = (req, res) => {
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
          result[0].college_name,
          result[0].college_field,
          result[0].college_city,
          result[0].college_state,
        ],
      ];

      const sql =
        "INSERT INTO wishlist (college_name, college_field, college_city, college_state) VALUES ?";

      db.query(sql, [data], (error, result) => {
        if (error) {
          console.log(error);
        }
        res.redirect("/search_colleges");
      });
    }
  );
};

*/
