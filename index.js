'use strict';
process.title = 'node-emoporemilio';

//* DEPENDENCIES *//
import environment from './environment.js';
import express from 'express';
import fs from 'fs';
import https from 'https';
import { Server } from 'socket.io';
import { setupBot } from './bot.js';

//* HTTPS *//
var privateKey = fs.readFileSync(environment.privateKey);
var certificate = fs.readFileSync(environment.certificate);
var chain = fs.readFileSync(environment.chain);
var credentials = { key: privateKey, cert: certificate, ca: chain };

//* EXPRESS INIT *//
var app = express();
app.use(express.static(environment.APP_BASE_PATH + 'public'));

const server = https
  .createServer(credentials, app)
  .listen(environment.EXPRESS_HTTPS_PORT, function () {
    console.log('EmoPorEmilio corriendo en el puerto ' + EXPRESS_HTTPS_PORT);
  });

//* BOT *//

const io = new Server(server);

setupBot(io);
