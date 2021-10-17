const { Server } = require("socket.io");
class SocketIO {
  constructor(server) {
    if (!SocketIO.instance) {
      SocketIO.instance = this;
      this.ws = new Server(server, { cors: { origin: "*", tranports: ["websocket"] } });
      this.ws.on("connection", (socket) => {
        console.log("Connected with " + socket.id);
      });
    }
    return SocketIO.instance;
  }

  /**
   *
   * @param {String} topic
   * @param {*} data
   */
  emit(topic, data) {
    this.ws.emit(topic, data);
  }
}

module.exports = SocketIO;
