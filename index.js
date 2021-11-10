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