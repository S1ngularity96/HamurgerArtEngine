const express = require("express");
const http = require("http");
const logger = require("morgan");
const cors = require("cors");
const path = require('path')

const backend = express();
backend.use(cors());
backend.use(logger("dev"));
backend.use(express.json());
backend.use(express.urlencoded({ extended: true }));
const apiResponse = require('./helper/api');
const router = require("./router/api");
const { env } = require("../config");

backend.use("/static/layers", express.static(path.join(env.PROJECT_DIR, "Layers")));
backend.use("/api", router);
backend.all("/api/*", function (req, res) {
  apiResponse.BadRequestResponse(
    res,
    `Api with Method ${req.method} and origin ${req.originalUrl} does not exist`,
  );
});

const { db, init } = require("../database/db");



async function StartServer() {
  try{
    await init();
  }catch(err){
    console.log("Could not create database");
  }
  const server = http.createServer(backend);
  server.listen(env.SERVER_PORT, function () {
    console.log("Server listening on port " + env.SERVER_PORT);
  });
}

process.on("exit", () => {
  db.close();
});

module.exports = { StartServer };
