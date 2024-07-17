const express = require("express");
const path = require("path");
const {MongoClient} = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
const csvtojson = require("csvtojson");
const fs = require("fs");
const { count } = require("console");

// Creating App
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

// Some Essential Data
const csvfilepath = path.join(__dirname,"zomato.csv");
const mongouri = process.env.mongo_uri;
const databaseName = "zomatodb";
const collectionName = "zomato_table";
const client = new MongoClient(mongouri);
let zomatoCollection;

// Countries and their Codes
const countries = {
    "India": 1,
    "Australia": 14,
    "Brazil": 30,
    "Canada": 37,
    "Indonesia": 94,
    "New Zealand": 148,
    "Philippines": 162,
    "Qatar": 166,
    "Singapore": 184,
    "South Africa": 189,
    "Sri Lanka": 191,
    "Turkey": 208,
    "UAE": 214,
    "United Kingdom": 215,
    "United States": 216
  }
  

//function to load the data into mongodb
const loadDatatoMongoDB = async () => {
    try{
        // Connecting to MongoDB server
        await client.connect();
        console.log(`Connected to ${databaseName} DB`);

        const db = client.db(databaseName);

        const collection = db.collection(collectionName);
        // Converting CSV to JSON using csvtojson
        const jsonArray = await csvtojson().fromFile(csvfilepath);

        const parsedArray = jsonArray.map(item => ({
            'Restaurant ID': parseInt(item['Restaurant ID'], 10),
            'Restaurant Name': item['Restaurant Name'],
            'Country Code': parseInt(item['Country Code'], 10),
            'City': item['City'],
            'Address': item['Address'],
            'Locality': item['Locality'],
            'Locality Verbose': item['Locality Verbose'],
            'Longitude': parseFloat(item['Longitude']),
            'Latitude': parseFloat(item['Latitude']),
            'Cuisines': item['Cuisines'].split(',').map(cuisine => cuisine.trim()),
            'Average Cost for two': parseInt(item['Average Cost for two'], 10),
            'Currency': item['Currency'],
            'Has Table booking': item['Has Table booking'],
            'Has Online delivery': item['Has Online delivery'],
            'Is delivering now': item['Is delivering now'],
            'Switch to order menu': item['Switch to order menu'],
            'Price range': parseInt(item['Price range'], 10),
            'Aggregate rating': parseFloat(item['Aggregate rating']),
            'Rating color': item['Rating color'],
            'Rating text': item['Rating text'],
            'Votes': parseInt(item['Votes'], 10)
        }));

        const result = await collection.insertMany(parsedArray);
        console.log(`${result.insertedCount} documents were inserted`);
    }
    catch(Err){
        console.log(`Error Occurred : ${Err}`);
    }
    finally{
        await client.close();
    }
}

// Function to connect to Mongo DB 
const connectToDatabase = async () => {
    try{
        await client.connect();
        console.log(`Connected to the ${databaseName} database`);
        zomatoCollection = client.db(databaseName).collection(collectionName);
    }
    catch(Err){
        console.log(`Error Connecting to the database : ${Err}`);
    }
}

// API1 : Home Page 
app.get("/", async (req,res) => {
    res.send("Hello World");
})

// API 2 : Loading the data to MongoDB
app.get("/loaddata", async (req,res) => {
    try{
        if(fs.existsSync(csvfilepath)){
            await loadDatatoMongoDB();
            res.send({success : `Data Loaded to MongoDB in ${collectionName} collection `});
        }
    }
    catch(Err){
        res.send({Error : `Error Occurred : ${Err}`});
    }
})



app.listen(3001,() => {
    console.log("Server is Running in http://localhost:3001");
})