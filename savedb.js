require("dotenv").config();

const mongo = require("mongodb");
const fs = require("fs");

const port = process.env.PORT || 3000;

const uri = process.env.MONGO_URI;
const client = new mongo.MongoClient(uri);

(async () => {
  const reader = fs.createReadStream("./w.txt");

  try {
    reader.on("data", async (chunk) => {
      try {
        await client.connect();
        const docs = chunk
          .toString()
          .split("\n")         
          .map((row) => {
            return {
              word: row.toLocaleLowerCase().replace(" ", "-"),
              todayWord: false,
              used: false,
            };
          })
          .filter(row => row.word.length >= 5);

        const database = client.db("termo");
        const words = database.collection("words");

        const options = { ordered: true };

        const result = await words.insertMany(docs, options);

        console.log(`${result.insertedCount} documents were inserted`);
      } catch (error) {
      } finally {
        await client.close();
      }
    });
  } catch (error) {
    console.error(error);
  }
})();
