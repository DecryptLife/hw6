const app = require("express");

var followers = {
  1: {
    username: "Harshit",
  },

  2: {
    username: "Apoorv",
  },

  3: {
    username: "Ameya",
  },
};

var id = 3;

const getFollowing = (req, res) => {
  res.send(followers);
};

const addFollower = (req, res) => {
  id++;
  followers[id]["username"] = req.params.mod_following;
  res.send(followers);
};

const removeFollower = (req, res) => {};
module.exports = (app) => {
  app.get("/following", getFollowing);
  app.put("/following/:mod_following", addFollower);
  app.delete("/following/:id", removeFollower);
};
