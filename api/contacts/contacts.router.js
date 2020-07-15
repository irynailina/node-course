const express = require("express");
const ContactController = require("./contact.controller.js");
const { validateCreateUser, createUser } = require("./contact.controller.js");
const contactController = require("./contact.controller.js");

const contactRouter = express.Router();

contactRouter.get("/", ContactController.listContacts);
contactRouter.post(
  "/",
  ContactController.validateAddContact,
  ContactController.addContact
);

contactRouter.get(
  "/users/current",
  ContactController.authorize,
  ContactController.getCurrentUser
);
contactRouter.get("/users", ContactController.getUsers);
contactRouter.post(
  "/auth/register",
  ContactController.validateCreateUser,
  ContactController.createUser
);
contactRouter.post(
  "/auth/login",
  ContactController.validateLogin,
  ContactController.login
);
contactRouter.post(
  "/auth/logout",
  ContactController.authorize,
  ContactController.logout
);

contactRouter.get(
  "/:id",
  ContactController.validateId,
  ContactController.getById
);
contactRouter.patch(
  "/:id",
  ContactController.validateId,
  ContactController.validateUpdateContact,
  ContactController.updateContact
);
contactRouter.delete(
  "/:id",
  ContactController.validateId,
  ContactController.removeContact
);

module.exports = contactRouter;
