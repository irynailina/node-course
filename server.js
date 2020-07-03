const express = require("express");
const cors = require("cors");
require("dotenv").config();
const contactRouter = require("./api/contacts/contacts.router");
const morgan = require("morgan");
const mongoose = require("mongoose");

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    await this.initDatabaseConnection();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
    this.initErrorHandling();
  }

  initServer() {
    this.server = express();
  }

  async initDatabaseConnection() {
    mongoose.set("useCreateIndex", true);
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan("tiny"));
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }

  initRoutes() {
    this.server.use("/", contactRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started listening on port", process.env.PORT);
    });
  }

  initErrorHandling() {
    this.server.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      return res.status(statusCode).send(err.message);
    });
  }
};
