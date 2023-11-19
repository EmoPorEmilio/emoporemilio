'use strict';
process.title = 'node-emoporemilio';

//* DEPENDENCIES *//
import environment from './environment.js';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { Server } from 'socket.io';
import { setupBot } from './bot.js';

//* EXPRESS INIT *//
var app = express();

let server = null;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(environment.APP_BASE_PATH + 'public'));
  //* HTTPS *//
  const privateKey = fs.readFileSync(environment.privateKey);
  const certificate = fs.readFileSync(environment.certificate);
  const chain = fs.readFileSync(environment.chain);
  const options = { requestCert: true, rejectUnauthorized: true, key: privateKey, cert: certificate, ca: chain };

  server = https
    .createServer(options, app)
    .listen(environment.EXPRESS_HTTPS_PORT, function () {
      console.log(
        'EmoPorEmilio corriendo en el puerto ' + environment.EXPRESS_HTTPS_PORT
      );
    });
} else {
  app.use(express.static(environment.APP_BASE_PATH_LOCAL + 'public'));
  server = http
    .createServer(app)
    .listen(environment.EXPRESS_HTTPS_PORT, function () {
      console.log(
        'EmoPorEmilio corriendo en el puerto ' + environment.EXPRESS_HTTPS_PORT
      );
    });
}

//* BOT *//

const io = new Server(server);

setupBot(io);
