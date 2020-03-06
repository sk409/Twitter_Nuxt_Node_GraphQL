const bodyParser = require("body-parser");
const cors = require("cors");
const DataLoader = require("dataloader");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const Sequelize = require("sequelize");
const session = require("express-session");

const batchGetters = require("./assets/js/batch-getters");
const schema = require("./schema");

const {
  conversationBatchGetter,
  conversationLengthBatchGetter,
  favoriteBatchGetterByTweetId,
  subscriptionBatchGetter,
  tweetBatchGetterById,
  tweetBatchGetterByParentId,
  tweetBatchGetterByUserId,
  userBatchGetterById
} = batchGetters;

require("dotenv").config();

const sequelize = new Sequelize(
  "twitter",
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWOR,
  {
    dialect: "mysql",
    host: "database"
  }
);

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5555",
    credentials: true
  })
);
app.use("/static", express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxage: 1000 * 60 * 60 * 24 * 30
    }
  })
);
app.use(
  "/graphql",
  (req, res, next) => {
    if (req.body.query) {
      console.log(req.body.query);
    }
    if (req.body.variables) {
      console.log(req.body.variables);
    }
    next();
  },
  graphqlHTTP((req, res) => ({
    context: {
      req,
      res,
      conversationLoader: new DataLoader(conversationBatchGetter),
      conversationLengthLoader: new DataLoader(conversationLengthBatchGetter),
      favoriteLoaderByTweetId: new DataLoader(favoriteBatchGetterByTweetId),
      subscriptionBatchLoader: new DataLoader(subscriptionBatchGetter),
      tweetLoaderById: new DataLoader(tweetBatchGetterById),
      tweetLoaderByParentId: new DataLoader(tweetBatchGetterByParentId),
      tweetLoaderByUserId: new DataLoader(tweetBatchGetterByUserId),
      userLoaderById: new DataLoader(userBatchGetterById)
    },
    graphiql: true,
    schema
  }))
);
app.listen("4000", () => {
  console.log("now listening for requests on port 4000");
});
