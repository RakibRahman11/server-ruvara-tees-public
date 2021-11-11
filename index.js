const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xpttu.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("ruvara-tees");
        const productCollection = database.collection("products");
        const commentCollection = database.collection("comments");
        const orderCollection = database.collection("orders");
        const usersCollection = database.collection("users");

        // GET all products
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // GET all comments
        app.get('/comments', async (req, res) => {
            const cursor = commentCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // GET all order products
        app.get('/placeOrder', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })


        // POST a new product
        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await productCollection.insertOne(product);
            res.json(result);
        })

        // POST user comment
        app.post('/comments', async (req, res) => {
            const comments = req.body
            const result = await commentCollection.insertOne(comments);
            res.json(result);
        })

        // POST place order
        app.post('/placeOrder', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })

        // DELETE any individual order
        app.delete('/placeOrder/:id', async (req, res) => {
            const id = req?.params?.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await orderCollection.deleteOne(query);
            res.json(result);
            console.log(result);
        })

        // DELETE any product from website
        app.delete('/products/:id', async (req, res) => {
            const id = req?.params?.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await productCollection.deleteOne(query);
            res.json(result);
            console.log(result);
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({ admin: isAdmin })
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        app.put('/users', async (req, res) => {
            const user = req.body
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        app.put('/users/admin', async (req, res) => {
            const user = req.body
            console.log(user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Ruvara Tees!')
})

app.listen(port, () => {
    console.log(`App listening :${port}`)
})