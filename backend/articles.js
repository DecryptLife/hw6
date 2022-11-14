const mongoose = require("mongoose");
const articleSchema = require("./src/articleSchema");
const Article = mongoose.model("article", articleSchema);
const connectionString =
  "mongodb+srv://bt22:xQ8BdgzsZt1f1iwc@cluster0.9auii05.mongodb.net/social?retryWrites=true&w=majority";

const db = mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const getArticles = (req, res) => {
  if (!req.cookies) {
    console.log("no cookies");
    return res.sendStatus(401);
  }
  console.log("boy", req.username);
  let pid = req.body.id;
  console.log(pid);
  (async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await connector.then(() => {
      if (pid) {
        Article.findOne({ pid: pid }, (err, docs) => {
          res.json(docs);
        });
      } else {
        Article.find({}, (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            res.json(docs);
          }
        });
      }
    });
  })();
};

const updateArticles = (req, res) => {
  const pid = req.body.id;
  const text = req.body.text;
  const author = req.username;

  Article.find({ pid: pid }, (err, docs) => {
    if (err) console.log(err);
    else {
      const article = docs;
      let updated = new Article({
        author: article["author"],
        text: text,
        date: article["date"],
      });
      Article.updateOne(
        { pid: pid, author: author },
        { text: text },
        (err, docs_up) => {
          if (err) {
            console.log(err);
          } else {
            console.log(docs_up);
          }
        }
      );
    }
  });

  res.send("Updating articles");
};

const addArticle = (req, res) => {
  let author = req.username;
  let text = req.body.text;
  console.log("adding article");
  (async () => {
    const connector = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let article = new Article({
      author: author,
      text: text,
      date: new Date().getTime(),
    });
    await connector.then(() => {
      article.save((err, docs) => {
        console.log("article added to database");
        let msg = { articles: docs };
        res.send(msg);
      });
    });
  })();
};

module.exports = (app) => {
  app.get("/articles/:id?", getArticles);
  app.put("/articles/", updateArticles);
  app.post("/article", addArticle);
};
