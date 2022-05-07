const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const port = process.env.port || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ds3xm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.ds3xm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const servicesCollection = client.db('geniusCar').collection('service');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            // console.log(service);
            res.send(service);
        })

        // POST 
        app.post('/service', async (req, res) => {
            const serviceDetails = req.body.data;
            console.log(serviceDetails);
            const doc = {
                name: serviceDetails.serviceName,
                description: serviceDetails.description,
                price: serviceDetails.price,
                img: serviceDetails.img
            }

            const result = await servicesCollection.insertOne(doc);
            res.send({ response: `A new service was added with _id : ${result.insertedId}` });
        })

        // DELETE 
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Server for Genius car service');
})

app.listen(port, () => {
    console.log('Listening on port number ', port);
})