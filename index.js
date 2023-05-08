
const express =require('express');
const cors = require('cors');
// for user id & password
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());









const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pfbgofj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


     const coffeeCollection = client.db('coffeeDB').collection('coffee');

//      get from database


        app.get('/coffee', async(req, res)=>{
                const cursor = coffeeCollection.find();
                const result = await cursor.toArray();
                res.send(result);
        })


//      sent to database
      app.post('/coffee', async(req, res)=>{
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result)
      })


//       for update to database

app.get('/coffee/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(query);
        res.send(result);
})

// specific one data updated


 app.put('/coffee/:id', async(req, res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert: true}
  const updatedCoffee = req.body;
  const coffee = {
    $set:{
      name:updatedCoffee.name,
      quantity:updatedCoffee.quantity,
      supplier:updatedCoffee.supplier,
      taste:updatedCoffee.taste,
      details:updatedCoffee.details,
      category:updatedCoffee.category,
      photo:updatedCoffee.photo
    }
  }

  const result = await coffeeCollection.updateOne(filter, coffee, options);
  res.send(result)


 })


//       for delete from database

   app.delete('/coffee/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
   })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
        res.send('Coffee making server is running')
})

app.listen(port, ()=>{
        console.log(`Coffee making server is running on port: ${port}`);
})