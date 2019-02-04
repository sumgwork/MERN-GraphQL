const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res, next) => res.send("Hello lucky user!!"));
app.listen(3000, () => {
  console.log("Server up and running on port 3000");
});
