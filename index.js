const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgaci.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());


app.get('/', (res,req)=> {
  res.send("Hello from Database it's working !!!")
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const registrations = client.db("volunteerNetwork").collection("volunteerRegistrations");
  
  app.post('/addRegistration', (req,res) => {
    const newRegistration = req.body;
    registrations.insertOne(newRegistration)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/events', (req,res)=>{
    queryEmail = req.query.email;
    registrations.find({email: queryEmail})
    .toArray((err, documents) => {
      res.status(200).send(documents)
    })
  })

});


app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening at http://localhost:5000`)
})