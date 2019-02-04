const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
app.use(bodyParser.json());
//basically tells the system that you want json to be used

// Temporary data
const events = [];

//Hooking GraphQL Express Schema
app.use(
  "/graphql",
  graphqlHttp({
    //Schema, contains list of queries and mutations
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
        }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event!
            }

            schema{
                query: RootQuery
                mutation: RootMutation
            }
        
    `),

    //Resolvers, containing actual implementation of schema items
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: args => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date().toISOString()
        };

        events.push(event);
        return event;
      }
    },
    graphiql: true
  })
);
// app.get("/", (req, res, next) => res.send("Hello lucky user!!"));
app.listen(3000, () => {
  console.log("Server up and running on port 3000");
});
