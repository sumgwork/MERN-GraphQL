const { buildSchema } = require("graphql");

module.exports = buildSchema(`

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

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type RootQuery {
    events: [Event!]!
    users: [User!]!
    bookings: [Booking!]!
    login(email: String!, password:String!):User
}

type RootMutation {
    createEvent(eventInput: EventInput): Event!
    createUser(userInput: UserInput): User!
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!):Event!
    
}

schema{
    query: RootQuery
    mutation: RootMutation
}

`);
