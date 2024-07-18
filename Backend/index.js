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

// API 3 : GET Restaurant Details using Restaurant ID
app.get("/restaurants/:restaurantId", async (req,res) => {
    try{
        const {restaurantId} = req.params;
        await connectToDatabase();
        const result = await zomatoCollection.findOne({"Restaurant ID":parseInt(restaurantId)});
        if(result)
        res.status(200).send({success : `Restaurant data with ID ${restaurantId} sent Successfully `,result});
        else{
        res.status(404).send({Error : `No Restaurant Found with ID ${restaurantId}`});
        }
    }
    catch(Error){
        res.send({Error : `No Restaurants Found`});
    }
    finally{
        await client.close();
    }
})

//API 4 : GET List of all Restaurants
app.get("/restaurants", async (req,res) => {
    try{
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        await connectToDatabase();
        const result = await zomatoCollection.find({}).skip(skip).limit(limit).toArray();
        const totalRestaurants = await zomatoCollection.countDocuments();

        res.status(200).send({success : "Restaurants List Sent Successfully", total:result.length,totalPages:Math.ceil(totalRestaurants/limit),result});
    }
    catch(Err){
        res.status(404).send({Error : `Error Occurred while fetching list : ${Err}`})
    }
})

//API 5 : Filter Restaurants by Country
app.get("/restaurants/country/:countryName", async (req,res) => {
    try{
        await connectToDatabase();
        if(req.params.countryName in countries){
        const result = await zomatoCollection.find({"Country Code":countries[req.params.countryName]}).toArray();
        res.send({success : `Restaurants in ${req.params.countryName} Sent Successfully`,result});
        }
        else
        res.send({Error : `There are no restaurants in the given Country ${req.params.countryName}`});
    }
    catch(Err){
        res.send({Error : `Error Occurred : ${Err}`});
    }
    finally{
        await client.close();
    }
})

//API 6 : Filter Restaurants by Average Spend for Two People
app.get("/restaurants/avgexpenditure/:costRange", async (req,res) => {
    try{
        await connectToDatabase();
        const result = await zomatoCollection.find({"Average Cost for two":{$lte:parseInt(req.params.costRange)}}).toArray();
        if(result.length>0)
        res.send({success : `Restaurants Sent Successfully`,result});
        else
        res.send({Error : `No Restaurants Found`});
        }
    catch(Err){
        res.send({Error : `Error Occurred : ${Err}`});
    }
    finally{
        await client.close();
    }
})

//API 7 : Filter Restaurants by Cuisines 
app.get("/restaurants/cuisines/:cuisineName", async (req,res) => {
    try{
        await connectToDatabase();
        const result = await zomatoCollection.find({ "Cuisines": { $in: [req.params.cuisineName] } }).toArray();
        if(result.length>0)
        res.send({success : `Restaurants in ${req.params.cuisineName} Sent Successfully`,result});
        else
        res.send({Error : `No Restaurants are Found with suggested Cuisine ${req.params.cuisineName}`});
    }
    catch(Err){
        res.send({Error : `Error Occurred : ${Err}`});
    }
    finally{
        await client.close();
    }
})

//API 8 : Filter the Restaurants by Country,AvgCostForTwo,Cuisines
// app.get("/filteredrestaurants", async (req,res) => {
//     try{
//         const page = parseInt(req.query.page)||1;
//         const limit = parseInt(req.query.limit)||10;
//         const countryName = parseInt(req.query.countryName)||1;
//         const avgCostForTwoPeople = parseInt(req.query.avgCostForTwoPeople)||0;
//         // const cuisines = req.query.cuisines||[];
//         const skip = (page-1)*limit;
//         const result = await zomatoCollection.find({"Country Code":countryName,"Average Cost for two":{$lte:parseInt(req.params.costRange)}}).skip(skip).limit(limit).toArray();
//         res.send({success : "Filters Applied Successfully",result});
//     }
//     catch(Err){
//         res.send({Error : `Error Occurred : ${Err}`});
//     }
//     finally{
//         await client.close();
//     }
// })
app.get("/filteredrestaurants", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const countryName = req.query.countryName;
        const avgCostForTwoPeople = parseInt(req.query.avgCostForTwoPeople) || 0;
        const cuisines = req.query.cuisines ? req.query.cuisines.split(',') : [];
        const skip = (page - 1) * limit;
        let queryObj = {};

        if (countryName && countryName!=="1111") {
            queryObj["Country Code"] = parseInt(countryName);
        }
        if (avgCostForTwoPeople && avgCostForTwoPeople!=="1111") {
            queryObj["Average Cost for two"] = { $gte: avgCostForTwoPeople };
        }

        if (cuisines.length > 0 && cuisines[0] !== undefined && req.query.cuisines!=="1111") {
            queryObj["Cuisines"] = { $in: cuisines };
        }
        await connectToDatabase();
        // Fetching data from the collection
        const totalPages = await zomatoCollection.countDocuments(queryObj);
        const result = await zomatoCollection.find(queryObj).skip(skip).limit(limit).toArray();
        res.send({ success: "Filters Applied Successfully", totalPages:Math.ceil(totalPages/limit),result });
    } catch (Err) {
        res.send({ Error: `Error Occurred: ${Err}` });
    } finally {
        await client.close();
    }
});


//API 5 : Filter Restaurants data by Country, Average Spend for Two People, Cuisines
// app.post("/restaurants", async (req,res) => {
//     console.log(req.body);
//     res.send({success : req.body});
// });

app.get("/cuisines", async (req,res) => {
    try{
        await connectToDatabase();
        const result = await zomatoCollection.find({}).toArray();
        // console.log(result.length);
        // const getBrazilianCuisines = result.filter((ele) => ele.Cuisines.includes("Brazilian"));
        const rescuisines = result.flatMap(ele => (ele.Cuisines).map(cuisine => cuisine.trim()));
        const uniqueCuisines = [...new Set(rescuisines)];
        const sortedCuisines = uniqueCuisines.sort();
        res.send({TotalCuisines : sortedCuisines.length,sortedCuisines });
        // res.send({total:result.length,rescuisines})
    }
    catch(Err){
        res.send({Error : `Error Occurred : ${Err}`});
    }
})



app.listen(3001,() => {
    console.log("Server is Running in http://localhost:3001");
})