const express = require("express");
const http = require("http");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const backend = express();
const SockIO = require("./websocket/sock");
backend.use(cors());

process.env.MODE === "test" ? null : backend.use(logger("dev"));

backend.use(express.json());
backend.use(express.urlencoded({ extended: true }));
const apiResponse = require("./helper/api");
const router = require("./router/api");
const { env, imagesDir, publicDir } = require("../config");

//custom static
backend.use("/static/layers", express.static(path.join(env.PROJECT_DIR, "Layers")));
backend.use("/static/generated", express.static(path.join(imagesDir)));
backend.use("/api", router);
backend.all("/api/*", function (req, res) {
  apiResponse.BadRequestResponse(
    res,
    `Api with Method ${req.method} and origin ${req.originalUrl} does not exist`
  );
});

const { mongoose, connect } = require("../database/db");

async function StartServer() {
  try {
    await connect();
    process.on("exit", async () => {
      await mongoose.disconnect();
    });
  } catch (err) {
    console.log(err.toString());
    console.log("Could not connect to database");
    process.exit(1);
  }
  const server = http.createServer(backend);
  server.listen(env.SERVER_PORT, function () {
    const sockIO = new SockIO(server);
    console.log(`Server listening on port http://localhost:${env.SERVER_PORT}/`);
  });
}
module.exports = { StartServer, app: backend };
