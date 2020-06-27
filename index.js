const argv = require("yargs").argv;
const express = require('express')
const PORT = 3000;

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts.js");
const { require } = require("yargs");

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

const app = express();

app.use(express.json());

app.post("/api/contacts", (req, res, next) => {
  console.log(reg.body);
})

app.listen(PORT, () => {
  console.log('server started listening on port', PORT);
})