const argv = require('yargs').argv

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts.js");
// const { require } = require("yargs");

// listContacts();
// getContactById(11)
// removeContact(1)
// addContact(13, "Chuck", "chucknorris@ukr.net", "(012) 123-1234")

function invokeAction({ action, id, name, email, phone }) {
    switch (action) {
      case 'list':
       listContacts()
        break;
  
      case 'get':
        getContactById(id)
        break;
  
      case 'add':
       addContact(id, name, email, phone)
        break;
  
      case 'remove':
        removeContact(id)
        break;
  
      default:
        console.warn('\x1B[31m Unknown action type!');
    }
  }
  
  invokeAction(argv);