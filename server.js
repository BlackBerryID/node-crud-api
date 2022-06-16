"use strict";
exports.__esModule = true;
var http = require("http");
require("dotenv/config");
var server = http.createServer();
var PORT = process.env.PORT || 5000;
server.listen(PORT, function () { return console.log("Server port ".concat(PORT)); });
