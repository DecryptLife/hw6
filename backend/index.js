const profile = require("./profile");
const following = require("./following");
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userSchema = require("./src/userSchema");
const auth = require("./src/auth");

const articleSchema = require("./src/articleSchema");
const articles = require("./articles");
const User = mongoose.model("user", userSchema);

const connectionString =
  "mongodb+srv://bt22:xQ8BdgzsZt1f1iwc@cluster0.9auii05.mongodb.net/social?retryWrites=true&w=majority";
app.use(express.json());
app.use(cookieParser());
const addUser = (req, res) => {
  (async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(req.params);

    let user = new User({ username: req.params.uname, created: Date.now() });

    await connector.then(() => {
      user.save(() => {
        console.log("User added to database");
      });
    });
    res.send({ name: user.username });
  })();
};

app.get("/", (req, res) => {
  // res.render("index");
  res.json({ message: "Hello from server!" });
});

app.post("/check", (req, res) => {});
auth(app);
profile(app);
articles(app);

app.post("/user/:uname", addUser);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
