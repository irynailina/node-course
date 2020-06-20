const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const data = await fsPromises.readFile("./db/contacts.json", "utf-8");
    return console.log(data);
  } catch (error) {
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const gotContact = JSON.parse(
      await fsPromises.readFile("./db/contacts.json", "utf-8")
    ).find((contact) => contact.id === contactId);
    return console.log(gotContact);
  } catch (error) {
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const contactsListAfterRemove = JSON.parse(
      await fsPromises.readFile("./db/contacts.json", "utf-8")
    ).filter((contact) => contact.id !== contactId);
    return console.log(contactsListAfterRemove);
  } catch (error) {
    throw error;
  }
}

async function addContact(name, email, phone) {
  try {
    const contactsList = JSON.parse(
      await fsPromises.readFile("./db/contacts.json", "utf-8")
    );
    contactsList.push({
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
    });
    const jsonContacts = JSON.stringify(contactsList);
    const updatedContactsList = await fsPromises.writeFile(
      "./db/contacts.json",
      jsonContacts,
      "utf-8"
    );
    return updatedContactsList;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
