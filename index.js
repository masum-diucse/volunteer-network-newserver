const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const ObjectId=require('mongodb').ObjectId;
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kdxcg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const eventCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  
  app.get('/getAllEvents',(req,res)=>{
    eventCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.post('/addEvent',(req,res)=>{
    const newEvent=req.body;
    eventCollection.insertOne(newEvent)
    .then(result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })

  app.delete('/deleteEvent/:id',(req,res)=>{
    const id=req.params.id;
    eventCollection.deleteOne({
      _id:ObjectId(id)
    }).then(result=>{
      res.send(result.deletedCount>0);
  })
  })

  console.log("DB CONNECTED")
});


app.get('/',(req,res)=>{
    res.send('Hearing from NODE')
})

app.listen(process.env.PORT || 5000)