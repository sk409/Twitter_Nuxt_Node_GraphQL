const cors = require("cors");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const Sequelize = require("sequelize");
const session = require("express-session");

const schema = require("./schema");

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
  graphqlHTTP((req, res) => ({
    context: { req, res },
    graphiql: true,
    schema
  }))
);
app.listen("4000", () => {
  console.log("now listening for requests on port 4000");
});
