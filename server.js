const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = 3011;


async function initializeApp() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("example");
        const product = db.collection("product");

        await product.insertOne({ name: "grich", price: "100" });
        console.log("Inserted a document");

        app.get('/', (req, res) => {
            res.send('Welcome to the homepage!');
        });

        app.get('/gor/test', async (req, res) => {
                const products = await product.find().toArray();
                res.json(products);
        });

        app.post('/gor/test', async (req, res) => {
            const { name, price } = req.body;
            res.send(`Received data - Name: ${name}, Price: ${price}`);
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        process.on('SIGINT', async () => {
            console.log("Shutting down...");
            try {
                await client.close();
                console.log("MongoDB connection closed");
            } catch (error) {
                console.error("Error closing MongoDB connection:", error);
            }
            process.exit(0);
        });

}

initializeApp();
