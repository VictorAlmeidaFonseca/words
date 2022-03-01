require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

const query = require("./db")

const cron = require('node-cron');

cron.schedule('59 23 * * *' , async () => {
    console.log('Running a job at 0:00 at America/Sao_Paulo timezone');

    await query.excludePreviusdWords()
    await query.chosseWord()

},  {
    scheduled: true,
    timezone: "America/Sao_Paulo"
})


app.get("/word", async (req, res, next) => {
  try {
    const result =  await query.fetchChossedWord()
    res.json(result);

  } catch (error) {
    req.logs = error.message || JSON.stringify(error);
    next(error);
  }

});

app.post("/word", async (req, res, next) => {
  try {
   
    await query.excludePreviusdWords()
    await query.chosseWord()

    res.json("ok");

  } catch (error) {
    req.logs = error.message || JSON.stringify(error);
    next(error); 
  }
});

app.use((req, res) => {
  res.json({
    error: req.logs,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
