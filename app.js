const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
app.use(bodyParser.json());
//basically tells the system that you want json to be used

// Temporary data
const events = [];

app.get("/", (req, res, next) => {
  res.send("Use /graphql option to use GraphiQL tool");
});
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
        return Event.find()
          .then(events => {
            events.map(event => (event._doc._id = event.id));
            //event.id - mongoose will convert native _id to a string
            return events;
          })
          .catch(err => {
            console.log("Error ", err);
            throw err;
          });
      },
      createEvent: args => {
        // const event = {
        //   _id: Math.random().toString(),
        //   title: args.eventInput.title,
        //   description: args.eventInput.description,
        //   price: +args.eventInput.price,
        //   date: new Date().toISOString()
        // };
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price
        });
        return event
          .save()
          .then(result => {
            return { ...result._doc }; //Gives all core properties and leaves metadata
          })
          .catch(err => {
            console.log("Error ", err);
            throw err;
          });
        return event;
      }
    },
    graphiql: true
  })
);
// app.get("/", (req, res, next) => res.send("Hello lucky user!!"));

//mongoose
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
