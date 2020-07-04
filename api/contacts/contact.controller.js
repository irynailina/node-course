const Joi = require("@hapi/joi");
const { MongoClient, ObjectID } = require("mongodb");
const contactModel = require("./contacts.model");
const {
  Types: { ObjectId },
} = require("mongoose");

const url =
  "mongodb://irynailina:ilina5808@hw3-mongodb-shard-00-00.f5ejk.mongodb.net:27017,hw3-mongodb-shard-00-01.f5ejk.mongodb.net:27017,hw3-mongodb-shard-00-02.f5ejk.mongodb.net:27017/<db-contacts>?ssl=true&replicaSet=atlas-11f0o4-shard-0&authSource=admin&retryWrites=true&w=majority";
const dbName = "db-contacts";

let db, contactsCollection;

async function main() {
  const client = await MongoClient.connect(url);
  console.log("Database connection successful");
  db = client.db(dbName);
  contactsCollection = db.collection("contacts");
}

main();

class ContactController {
  async listContacts(req, res, next) {
    try {
      const allContacts = await contactModel.find();
      return res.status(200).json(allContacts);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const targetContact = await contactModel.findById(id);
      if (!targetContact) {
        return res.status(404).send("Contact not found");
      }
      return res.status(200).send(targetContact);
    } catch (err) {
      next(err);
    }
  }

  async addContact(req, res, next) {
    try {
      const newContact = await contactModel.create(req.body);
      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }
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

  async updateContact(req, res, next) {
    try {
      const id = req.params.id;
      const updateContact = await contactModel.findContactByIdAndUpdate(
        id,
        req.body
      );
      if (!updateContact) {
        return res.status(404).send("contact not found");
      }
      console.log(updateContact);
      return res.status(200).send("contact updated");
    } catch (err) {
      next(err);
    }
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

  async removeContact(req, res, next) {
    try {
      const id = req.params.id;
      const deletedContact = await contactModel.findByIdAndDelete(id);
      if (!deletedContact) {
        return res.status(404).send("contact not found");
      }
      console.log(deletedContact);
      return res.status(200).send("contact deleted");
    } catch (err) {
      next(err);
    }
  }

  validateId(req, res, next) {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Not found");
    }
    next();
  }
}

module.exports = new ContactController();
