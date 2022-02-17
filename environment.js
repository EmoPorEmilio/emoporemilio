var environment = {};

environment.EXPRESS_HTTPS_PORT = 443;

environment.APP_BASE_PATH = "/home/emoporemilio/";
environment.certificate = "/etc/letsencrypt/live/emoporemilio.uy/fullchain.pem";
environment.privateKey = "/etc/letsencrypt/live/emoporemilio.uy/privkey.pem"
environment.chain = "/etc/letsencrypt/live/emoporemilio.uy/chain.pem"

module.exports = environment;

