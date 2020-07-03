const path = require("path");
const contacts = require(path.join(__dirname, "../../db/contacts.json"));
const Joi = require("@hapi/joi");
const uuid = require("uuid");
const { MongoClient, ObjectID } = require("mongodb");
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

  async listContacts(req, res, next) {
    try {
      const allContacts = await contactsCollection.find().toArray();
      return res.status(200).json(allContacts);
    } catch (err) {
      next(err);
    }
  }

  async _getById(req, res, next) {
    try {
      const id = req.params.id;
      if (!ObjectID.isValid(id)) {
        return res.status(404).send("Not found");
      }
      const targetContact = await contactsCollection.findOne({
        _id: new ObjectID(id),
      });
      if (!targetContact) {
        return res.status(404).send("Contact not found");
      }
      return res.status(200).send(targetContact);
    } catch (err) {
      next(err);
    }
  }

  async _addContact(req, res, next) {
    try {
      const newContact = await contactsCollection.insert(req.body);
      return res.status(201).json(newContact.ops);
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

  async _updateContact(req, res, next) {
    try {
      const id = req.params.id;
      if (!ObjectID.isValid(id)) {
        return res.status(404).send("contact not found");
      }
      const updateContact = await contactsCollection.updateOne(
        {
          _id: new ObjectID(id),
        },
        {
          $set: req.body,
        }
      );
      if (!updateContact.modifiedCount) {
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

  async _removeContact(req, res, next) {
    try {
      const id = req.params.id;
      if (!ObjectID.isValid(id)) {
        return res.status(404).send("Not found");
      }
      const deletedContact = await contactsCollection.deleteOne({
        _id: new ObjectID(id),
      });
      if (!deletedContact.deletedCount) {
        return res.status(404).send("contact not found");
      }
      console.log(deletedContact);
      return res.status(200).send("contact deleted");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContactController();
