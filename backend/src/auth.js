const mongoose = require("mongoose");
const userSchema = require("./userSchema");
const profileSchema = require("./profileSchema");
const Profile = mongoose.model("profile", profileSchema);
const User = mongoose.model("user", userSchema);
const connectionString =
  "mongodb+srv://bt22:xQ8BdgzsZt1f1iwc@cluster0.9auii05.mongodb.net/social?retryWrites=true&w=majority";

let sessionUser = {};
let cookieKey = "sid";
let userObjs = {};

const md5 = require("md5");

function isLoggedIn(req, res, next) {
  console.log("came here");
  if (!req.cookies) {
    console.log("did");
    return res.sendStatus(401);
  } else {
    console.log("cookie exist: ", req.cookies);
  }

  let sid = req.cookies[cookieKey];

  // no sid for cookie key
  if (!sid) {
    return res.sendStatus(401);
  }

  let username = sessionUser[sid];
  console.log("Username: ", username);
  console.log(sessionUser);
  if (username) {
    req.username = username;
    console.log("Did it go?");
    next();
  } else {
    return res.sendStatus(401);
  }
}

function register(req, res) {
  console.log("registering");
  let username = req.body.username;
  let email = req.body.email;
  let headline = req.body.headline;
  let dob = req.body.dob;
  let zipcode = req.body.zipcode;
  let password = req.body.password;

  if (!username || !email || !dob || !zipcode || !password || !headline)
    return res.status(400).send("Missing required parameters");

  let salt = username + "lively";

  let hash = md5(salt + password);

  (async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    var createdTime = new Date().getTime();

    let user = new User({
      username: username,
      password: hash,
      created: createdTime,
    });

    let user_profile = new Profile({
      username: username,
      email: email,
      headline: headline,
      dob: dob,
      zipcode: zipcode,
      created: createdTime,
    });

    await connector.then(() => {
      user.save(() => {
        console.log("User added to database successfully");
      });

      user_profile.save(() => {
        console.log("Profile created for user");
      });
    });

    let msg = { result: "success", username: username };
    res.send(msg);
  })();
}

const login = (req, res) => {
  console.log("came her");
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password)
    return res.status(400).send("Missing username or password");

  let user = userObjs[username];
  console.log(user);
  (async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await connector.then(() => {
      // salt the password
      // check if the username and password matches
      let salt = username + "lively";
      let hash = md5(salt + password);

      User.findOne({ username: username }, (err, docs) => {
        if (err) console.log(err);
        else {
          if (docs) {
            let userDetails = docs;
            if (
              userDetails["username"] == username &&
              userDetails["password"] == hash
            ) {
              let sid = md5(hash + username);
              console.log(sid);
              res.cookie(cookieKey, sid, {
                maxAge: 3600 * 1000,
                httpOnly: true,
              });
              sessionUser[sid] = username;
              let msg = { username: username, result: "success" };
              res.send(msg);
            } else {
              res.send("Invalid credentials");
            }
          } else {
            res.send("User does not exist");
          }
        }
      });
    });
  })();
};

const changePassword = (req, res) => {
  if (!req.cookies) {
    return res.sendStatus(401);
  }
  let sid = req.cookies[cookieKey];

  let username = sessionUser[sid];
  const new_password = req.body.password;
  let salt = username + "lively";
  let hash = md5(salt + new_password);

  if (!new_password) return res.status(400).send("New password not given");

  User.updateOne({ username: username }, { password: hash }, (err, docs) => {
    if (err) console.log(err);
    else {
      let msg = { username: username, result: "success" };
      res.send(msg);
    }
  });
};

const logout = (req, res) => {
  // if (!req.cookies) return res.sendStatus(401);
  // let sid = req.cookies[cookieKey];
  if (!req.cookies) return res.sendStatus(401);
  console.log("here");
  res.clearCookie(cookieKey);
  // delete sessionUser(sid);
  let msg = "OK";
  res.send(msg);
  res.end();
};

module.exports = (app) => {
  app.post("/register", register);
  app.post("/login", login);
  app.use(isLoggedIn);
  app.put("/password", changePassword);
  app.put("/logout", logout);
};
