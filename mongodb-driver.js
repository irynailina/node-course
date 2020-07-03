const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://irynailina:ilina5808@hw3-mongodb-shard-00-00.f5ejk.mongodb.net:27017,hw3-mongodb-shard-00-01.f5ejk.mongodb.net:27017,hw3-mongodb-shard-00-02.f5ejk.mongodb.net:27017/<db-contacts>?ssl=true&replicaSet=atlas-11f0o4-shard-0&authSource=admin&retryWrites=true&w=majority';
const dbName = 'db-contacts';

async function main() {
    // console.log(MongoClient.connect(url));
    const client = await MongoClient.connect(url)
    console.log("Database connection successful");
    const db = client.db(dbName)
    const contacts = db.collection('contacts');
    // await contacts.insertOne
    // console.log(await contacts.find({name: "Allen Raymond"}).toArray());
}

module.exports = main()