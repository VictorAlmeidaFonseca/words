const mongo = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new mongo.MongoClient(uri);

const database = client.db(process.env.MONGO_DB);
const WORDS = database.collection(process.env.MONGO_COLLECTION)

let conn = null

async function excludePreviusdWords() {
  try {

    if (!conn) {
        await client.connect();
    }

    const filter = { todayWord: true };

    const updateDoc = {
      $set: {
        todayWord: false,
        used: true,
      },
    };

    const result = await WORDS.updateMany(filter, updateDoc);

    console.log(`Updated ${result.modifiedCount} documents`);
    return result;
  } catch (error) {
    throw error;
  }
}

async function chosseWord() {
  try {
    
    if (!conn) {
        await client.connect();
    }
    
    const total = await WORDS.countDocuments();
    const random = Math.floor(Math.random() * total);


    const filter = { used: false };

    const options = {
      skip: random,
      limit: 1,
    };

    const { _id : id } = await WORDS.findOne(filter, options)

    const updateDoc = {
      $set: {
        todayWord: true, 
        used: true,
      },
    };

    const result = await WORDS.updateOne({_id : mongo.ObjectId(id)}, updateDoc);

    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );

    return result;
  } catch (error) {}
}

async function fetchChossedWord() {
  try {
  
    if (!conn) {
        await client.connect();
    }  
    const filter = { todayWord: true };
    const response = await WORDS.findOne(filter);
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = { fetchChossedWord, chosseWord, excludePreviusdWords };
