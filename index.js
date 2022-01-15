"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = "node-emoporemilio";

//* DEPENDENCIES *//
var environment = require("./environment");
var express = require("express");
var https = require("https");

//* HTTPS *//
var privateKey  = fs.readFileSync(environment.privateKey, 'utf8');
var certificate = fs.readFileSync(environment.certificate, 'utf8');
var credentials = {key: privateKey, cert: certificate}

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

https
  .createServer(
    credentials,
    app
  )
  .listen(environment.EXPRESS_PORT, function () {
    console.log(
      "EmoPorEmilio corriendo en el puerto " + environment.EXPRESS_PORT
    );
  });
