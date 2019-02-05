const bcrypt = require("bcrypt");

const Event = require("../../models/event");
const User = require("../../models/user");

module.exports = {
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
};
