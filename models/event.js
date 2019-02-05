const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// MongoDB schema for Event - this is like a plan
const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  creator: { type: Schema.Types.ObjectId, ref: "User" }
});

// This creates a blueprint (class), is also a constructor
var Event = mongoose.model("Event", eventSchema);

module.exports = Event;
