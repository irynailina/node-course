const express = require("express");
const ContactController = require("./contact.controller.js");

const contactRouter = express.Router();

contactRouter.get("/", ContactController.listContacts);
contactRouter.post(
  "/",
  ContactController.validateAddContact,
  ContactController.addContact
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
