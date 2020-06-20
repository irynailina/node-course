const fs = require("fs");
const path = require("path");
const { error } = require("console");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "contacts.js");

// console.log(contactsPath);

function listContacts() {
  fs.readFile("./db/contacts.json", "utf-8", (error, data) => {
    if (error) {
      console.log(error);
    } else console.log(data);
  });
}

// listContacts();

function getContactById(contactId) {
  fs.readFile("./db/contacts.json", "utf-8", (error, data) => {
    if (error) {
      console.log(error);
    }
    const getContact = JSON.parse(data).find(
      (contact) => contact.id === contactId
    );
    console.log(getContact);
  });
}

// getContactById(2);

function removeContact(contactId) {
  fs.readFile("./db/contacts.json", "utf-8", (error, data) => {
    if (error) {
      console.log(error);
    }
    const removedContact = JSON.parse(data).filter(
      (contact) => contact.id !== contactId
    );
    console.log(removedContact);
  });
}

// removeContact(2)

function addContact(id, name, email, phone) {
  fs.readFile("./db/contacts.json", "utf-8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      const contacts = JSON.parse(data);
      contacts.push({ id: id, name: name, email: email, phone: phone });
      const json = JSON.stringify(contacts)
      fs.writeFile("./db/contacts.json", json, 'utf-8', (error, data) => {
        if (error) {
          console.log(error);
        } 
      });
      console.log(data);
    }
  });
}

// addContact("11", "Iryna", "iryna@gmail.com", "(012) 345-6789");

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
