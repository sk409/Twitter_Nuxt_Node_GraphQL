const cors = require("cors");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const Sequelize = require("sequelize");

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
    origin: "http://localhost:5555"
  })
);
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);
app.listen("4000", () => {
  console.log("now listening for requests on port 4000");
});
