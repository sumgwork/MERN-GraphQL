const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
app.use(bodyParser.json());
//basically tells the system that you want json to be used

//Hooking GraphQL Express Schema
app.use(
  "/graphql",
  graphqlHttp({
    //Schema, contains list of queries and mutations
    schema: buildSchema(`

            type RootQuery {
                events: [String!]!
            }

            type RootMutation {
                createEvent(name: String!): String!
            }

            schema{
                query: RootQuery
                mutation: RootMutation
            }
        
    `),

    //Resolvers, containing actual implementation of schema items
    rootValue: {
      events: () => {
        return ["Cooking", "Sailing", "Coding"];
      },
      createEvent: args => {
        const eventName = args.name;
        return eventName;
      }
    },
    graphiql: true
  })
);
// app.get("/", (req, res, next) => res.send("Hello lucky user!!"));
app.listen(3000, () => {
  console.log("Server up and running on port 3000");
});
