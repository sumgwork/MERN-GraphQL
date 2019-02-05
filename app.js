const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQLSchema = require("./graphql/schema");
const graphQLResolvers = require("./graphql/resolvers");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
app.use(bodyParser.json());
//basically tells the system that you want json to be used

app.get("/", (req, res, next) => {
  res.send("Use /graphql option to use GraphiQL tool");
});
//Hooking GraphQL Express Schema
app.use(
  "/graphql",
  graphqlHttp({
    //Schema, contains list of queries and mutations
    schema: graphQLSchema,

    //Resolvers, containing actual implementation of schema items
    rootValue: graphQLResolvers,

    graphiql: true
  })
);

//mongoose connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-la3tk.mongodb.net/${process.env.MONGO_DB}?retryWrites=true `
  )
  .then(() => {
    app.listen(3000, () => {
      console.log(
        "Server up and connected to MongoDB and running on port 3000"
      );
    });
  })
  .catch(err => console.log("Error while connecting MongoDB: " + err));
