"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = "node-emoporemilio";

//* DEPENDENCIES *//
var environment = require("./environment");
var express = require("express");

//* EXPRESS INIT *//
var app = express();
app.use(express.static(environment.APP_BASE_PATH + "public"));

//* ENDPOINTS *//
app.all("*", (_req, res) => {
  try {
    res.sendFile(environment.APP_BASE_PATH + "index.html");
  } catch (error) {
    res.json({ success: false, message: "Ha ocurrido un error" });
  }
});


app.listen(environment.EXPRESS_PORT, function () {
  console.log(
    "EmoPorEmilio corriendo en el puerto " + environment.EXPRESS_PORT
  );
});
