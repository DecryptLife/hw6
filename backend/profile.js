const { default: mongoose } = require("mongoose");
const profileSchema = require("./src/profileSchema");
const Profile = mongoose.model("profile", profileSchema);

var profile = {
  username: "DLeebron",
  headline: "This is my headline!",
  email: "foo@bar.com",
  zipcode: 12345,
  dob: "128999122000",
  avatar:
    "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg",
};

const getHeadline = (req, res) => {
  var username = req.body.user;

  if (!username) {
    return res.status(400).send("Please provide an username");
  }
  Profile.findOne({ username: username }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log("WTF");
      console.log(docs);
      let msg = { username: docs["username"], headline: docs["headline"] };
      res.send(msg);
    }
  });
  console.log("me called");
  // this return the requested user headline
  // res.send({ username: profile["username"], headline: profile["headline"] });
};

const updateHeadline = (req, res) => {
  const new_headline = req.body.headline;

  if (!new_headline) {
    res.status(400).send("Please provide a headline to update");
  }
  const username = req.username;
  Profile.updateOne(
    { username: username },
    { headline: new_headline },
    (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: username, headline: new_headline };
        res.send(msg);
      }
    }
  );
};

const getEmail = (req, res) => {
  const username = req.body.user;
  const currentUser = req.username;
  if (!username) {
    Profile.findOne({ username: currentUser }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: currentUser, email: docs["email"] };
        res.send(msg);
      }
    });
  } else {
    Profile.findOne({ username: username }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: username, email: docs["email"] };
        res.send(msg);
      }
    });
  }
};

const updateEmail = (req, res) => {
  const currUser = req.username;
  const new_email = req.body.email;
  Profile.updateOne(
    { username: currUser },
    { email: new_email },
    (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: currUser, email: new_email };
        res.send(msg);
      }
    }
  );
};

const getDOB = (req, res) => {
  const username = req.body.user;
  const currUser = req.username;

  if (!username) {
    Profile.findOne({ username: currUser }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: currUser, dob: docs["dob"] };
        res.send(msg);
      }
    });
  } else {
    Profile.findOne({ username: username }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: username, dob: docs["dob"] };
        res.send(msg);
      }
    });
  }
};

const getZipCode = (req, res) => {
  const username = req.body.user;
  const currUser = req.username;

  if (!username) {
    Profile.findOne({ username: currUser }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: currUser, zipcode: docs["zipcode"] };
        res.send(msg);
      }
    });
  } else {
    Profile.findOne({ username: username }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: username, zipcode: docs["zipcode"] };
        res.send(msg);
      }
    });
  }
};

const updateZipCode = (req, res) => {
  const currUser = req.username;
  const new_zipcode = req.body.zipcode;

  if (!new_zipcode) {
    return res.status(400).send("New zip code not given");
  }

  Profile.updateOne(
    { username: currUser },
    { zipcode: new_zipcode },
    (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        let msg = { username: currUser, zipcode: new_zipcode };
        res.send(msg);
      }
    }
  );
};

const updateAvatar = (req, res) => {
  res.send(
    '<input type="file" accept="image/*" onChange={(e) => handleImageChange(e)}/>'
  );
};

module.exports = (app) => {
  app.get("/headline/:user?", getHeadline);
  app.put("/headline", updateHeadline);
  app.get("/email/:user?", getEmail);
  app.put("/email", updateEmail);
  app.get("/dob/:user?", getDOB);
  app.get("/zipcode/:user?", getZipCode);
  app.put("/zipcode", updateZipCode);
  // app.get("/avatar", getAvatar);
  app.put("/avatar/", updateAvatar);
};
