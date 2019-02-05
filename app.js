const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Event = require("./models/event");
const User = require("./models/user");

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
            creator: User!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
        }

        type User {
          _id: ID!
          name: String!
          password: String
          email: String!
          createdEvents: [Event!]
        }

        input UserInput{
          name: String!
          password: String!
          email: String!
        }

        type RootQuery {
            events: [Event!]!,
            users: [User!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event!,
            createUser(userInput: UserInput): User!
        }

        schema{
            query: RootQuery
            mutation: RootMutation
        }
        
    `),

    //Resolvers, containing actual implementation of schema items
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find().populate("creator");
          // events.map(event => (event._doc._id = event.id));
          return events;
        } catch (err) {
          console.log("Error ", err);
          throw err;
        }
      },
      createEvent: async args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          creator: "5c58ff87a4335d14b8d9c7ce"
        });
        try {
          await event.save();
          const user = await User.findById("5c58ff87a4335d14b8d9c7ce");
          if (!user) {
            throw new Error("No such user exists");
          }
          user.createdEvents.push(event);
          await user.save();

          return event;
        } catch (err) {
          console.log("Error ", err);
          throw err;
        }
      },
      users: async () => {
        try {
          const users = await User.find().populate("createdEvents");
          users.map(user => (user.password = null));
          return users;
        } catch (err) {
          console.log("Error ", err);
          throw err;
        }
      },
      createUser: async args => {
        const password = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
          name: args.userInput.name,
          email: args.userInput.email,
          password
        });
        try {
          const existingUser = await User.findOne({
            email: args.userInput.email
          });
          if (existingUser)
            throw new Error("User with this email id already exists");

          await user.save();
          user.password = null;
          return user;
        } catch (err) {
          console.log("Error ", err);
          throw err;
        }
      }
    },
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
