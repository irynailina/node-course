const path = require("path");
const contacts = require(path.join(__dirname, "../../db/contacts.json"));
const Joi = require("@hapi/joi");
const uuid = require("uuid");

class ContactController {
  get getById() {
    return this._getById.bind(this);
  }

  get addContact() {
    return this._addContact.bind(this);
  }

  get updateContact() {
    return this._updateContact.bind(this);
  }

  get removeContact() {
    return this._removeContact.bind(this);
  }

  listContacts(req, res, next) {
    return res.status(200).json(contacts);
  }

  _getById(req, res, next) {
    const id = parseInt(req.params.id);
    const targetContact = contacts.find((contact) => contact.id === id);
    if (!targetContact) {
      return res.status(404).send("Not found");
    }
    console.log(targetContact);
    return res.status(200).send(targetContact);
  }

  _addContact(req, res, next) {
    const id = uuid.v4();
    const newContact = {
      ...req.body,
      id,
    };
    contacts.push(newContact);
    console.log(contacts);
    return res.status(201).json(newContact);
  }

  validateAddContact(req, res, next) {
    const addContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const result = addContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send("missing required field");
    }
    next();
  }

  _updateContact(req, res, next) {
    const targetContactIndex = this.findContactIndexById(res, req.params.id);

    contacts[targetContactIndex] = {
      ...contacts[targetContactIndex],
      ...req.body,
    };

    console.log("contacts", contacts);
    return res.status(200);
  }

  validateUpdateContact(req, res, next) {
    const updateContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });

    const result = updateContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send("missing fields");
    }
    next();
  }

  _removeContact(req, res, next) {
    const targetContactIndex = this.findContactIndexById(res, req.params.id);
    contacts.splice(targetContactIndex, 1);
    console.log(contacts);
    return res.status(200).send("contact deleted");
  }

  findContactIndexById(res, contactId) {
    const id = parseInt(contactId);
    const targetContactIndex = contacts.findIndex(
      (contact) => contact.id === id
    );
    if (targetContactIndex === -1) {
      return res.status(404).send("Not found");
    }
    return targetContactIndex;
  }
}

module.exports = new ContactController();
