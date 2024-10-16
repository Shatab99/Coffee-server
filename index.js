const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware

app.use(express.json())
app.use(cors())





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://shatab2:12345@cluster0.tevdclv.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection

        const coffee = client.db('CoffeeDB').collection('CoffeeForms')
        const userCollection = client.db('CoffeeDB').collection('Users')

        app.get('/allcoffee', async (req, res) => {
            const cursor = coffee.find()
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/addcoffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)
            const result = await coffee.insertOne(newCoffee)
            res.send(result)
        })

        app.get('/addcoffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffee.findOne(query)
            res.send(result)
        })

        app.put('/addcoffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const newCoffee = {
                $set: {
                    name: updatedCoffee.name,
                    quantity: updatedCoffee.quantity,
                    price: updatedCoffee.price,
                    suplier: updatedCoffee.suplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    photoURL: updatedCoffee.photoURL
                },
            };
            const result = await coffee.updateOne(filter, newCoffee, options)
            res.send(result)
        })



        app.delete('/addcoffee/:id', async (req, res) => {
            const id = req.params.id;
            const result = await coffee.deleteOne({ _id: new ObjectId(id) });
            res.send(result)
        })

        // user info

        app.get('/users', async(req, res)=>{
            const cursor = userCollection.find();
            const result = await cursor.toArray(cursor);
            res.send(result)
        })
        
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await userCollection.findOne(query)
            res.send(result)
        })



        app.post('/users', async(req,res)=>{
            const newUser =  req.body;
            console.log(newUser)
            const result = await userCollection.insertOne(newUser);
            res.send(result)
        })

        app.delete('/users/:id', async(req ,res)=>{
            const id = req.params.id;
            const result= await userCollection.deleteOne({_id: new ObjectId(id)});
            res.send(result)
        })
        app.patch('/users', async(req,res)=>{
            const user = req.body;
            const filter = { email : user.email}
            const updated = {
                $set : {
                    lastloggedAt : user.lastloggedAt
                }
            }
            const result = await userCollection.updateOne(filter,updated)
            res.send(result)
            
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Welcome to Coffee server")
})



app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})