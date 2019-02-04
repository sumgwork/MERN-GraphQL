const mongoose = require("mongoose");

// MongoDB schema for Event - this is like a plan
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// This creates a blueprint (class), is also a constructor
var Event = mongoose.model("Event", eventSchema);

module.exports = Event;
