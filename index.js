const argv = require("yargs").argv;
const express = require("express");
const Joi = require("@hapi/joi");
const uuid = require("uuid");
const morgan = require('morgan')
const PORT = 3000;

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts.js");
// const { require } = require("yargs");

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      listContacts();
      break;

    case "get":
      getContactById(id);
      break;

    case "add":
      addContact(name, email, phone);
      break;

    case "remove":
      removeContact(id);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);

// ===================================

const app = express();

app.use(express.json());
app.use(morgan('tiny'))

function validateCreateUser(req, res, next) {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  const result = userSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json(result.error);
  }
  next();
}

app.post("/contacts", validateCreateUser, (req, res, next) => {
 const id = uuid.v4();
 
  console.log(id);
  return res.send("hello");
});

app.listen(PORT, () => {
  console.log("Server started listening on port", PORT);
});


app.get('/contacts', listContacts)
