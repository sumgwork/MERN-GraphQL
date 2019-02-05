const bcrypt = require("bcrypt");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

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
  bookings: async () => {
    try {
      const bookings = await Booking.find()
        .populate("event")
        .populate("user");
      return bookings;
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
  },

  bookEvent: async args => {
    const fetchedEvent = await Event.findById(args.eventId);
    if (!fetchedEvent) {
      throw new Error("Incorrect event id");
    }
    const booking = new Booking({
      user: "5c58ff87a4335d14b8d9c7ce",
      event: fetchedEvent
    });
    const result = await booking.save();
    return result;
  },

  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      if (!booking) {
        throw new Error("Incorrect booking id");
      }
      const event = booking.event;
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
