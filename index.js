"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = "node-emoporemilio";

//* DEPENDENCIES *//
const environment = require("./environment");
const express = require("express");
const fs = require("fs");
const https = require("https");
const path = require("path"); 
const { EXPRESS_HTTPS_PORT } = require("./environment");

//* HTTPS *//
var privateKey  = fs.readFileSync(environment.privateKey);
var certificate = fs.readFileSync(environment.certificate);
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

https.createServer(credentials, app)
  .listen(EXPRESS_HTTPS_PORT, function() {
    console.log(
      "EmoPorEmilio corriendo en el puerto " + EXPRESS_HTTPS_PORT
    );
  });
