const express = require("express");
const ContactController = require("./contact.controller.js");
const contactController = require("./contact.controller.js");

const contactRouter = express.Router();

contactRouter.get("/contacts", ContactController.listContacts);
contactRouter.get("/contacts/:id", ContactController.getById);
contactRouter.post(
  "/contacts",
  ContactController.validateAddContact,
  ContactController.addContact
);
contactRouter.patch(
  "/contacts/:id",
  contactController.validateUpdateContact,
  contactController.updateContact
);
contactRouter.delete("/contacts/:id", contactController.removeContact);

module.exports = contactRouter;