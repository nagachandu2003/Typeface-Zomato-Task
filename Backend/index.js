const express = require("express");
const path = require("path");
const {MongoClient} = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
const csvtojson = require("csvtojson");
const multer = require("multer"); 
const fs = require("fs");
const Clarifai = require("clarifai");

// Creating App
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

// Clarifai API Setup
const clarifaiApp = new Clarifai.App({
apiKey: "e9efa0d0c6864a698e22dfa77ec3148e", // Replace with your Clarifai API Key
});

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" }); // Files will temporarily be saved in 'uploads/'
  

// Some Essential Data
const csvfilepath = path.join(__dirname,"zomato.csv");
const mongouri = process.env.mongo_uri;
const databaseName = "zomatodb";
const collectionName = "zomato_table2";
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
            "location": {
                "type": "Point",
                "coordinates": [parseFloat(item['Longitude']),parseFloat(item['Latitude'])]  // [longitude, latitude]
            },
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
}

// loadDatatoMongoDB();


// Function to connect to Mongo DB 
const connectToDatabase = async () => {
    try{
        await client.connect();
        console.log(`Connected to the ${databaseName} database`);
        zomatoCollection = client.db(databaseName).collection(collectionName);
        await zomatoCollection.createIndex({ "location": "2dsphere" });
        console.log('2dsphere index created on "location" field');

    }
    catch(Err){
        console.log(`Error Connecting to the database : ${Err}`);
    }
}

connectToDatabase();

// Middlewares
const parseFilters = (req, res, next) => {
  const { page, limit, countryName, avgCostForTwoPeople, cuisines } = req.query;

  req.filters = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      countryName: countryName ? parseInt(countryName) : null,
      avgCostForTwoPeople: avgCostForTwoPeople ? parseInt(avgCostForTwoPeople) : null,
      cuisines: cuisines ? cuisines.split(',') : [],
  };
  next();
};

const buildQuery = (req, res, next) => {
  const { countryName, avgCostForTwoPeople, cuisines } = req.filters;
  const queryObj = {};

  if (countryName) {
      queryObj["Country Code"] = countryName;
  }
  if (avgCostForTwoPeople) {
      queryObj["Average Cost for two"] = { $gte: avgCostForTwoPeople };
  }
  if (cuisines.length > 0 && cuisines[0] !== undefined) {
      queryObj["Cuisines"] = { $in: cuisines };
  }
  req.queryObj = queryObj; // Attach to request object for later use
  next();
};

const pagination = async (req, res, next) => {
  try {
      const { page, limit } = req.filters;
      const skip = (page - 1) * limit;
      req.pagination = { skip, limit };
      next();
  } catch (error) {
      res.status(400).send({ Error: "Pagination Error" });
  }
};






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
})

//API 4 : GET List of all Restaurants
app.get("/restaurants",
  parseFilters,      // Middleware 1: Parse query params
  buildQuery,        // Middleware 2: Build query object
  pagination,        // Middleware 3: Calculate pagination
  async (req, res) => {
      try {
          const { skip, limit } = req.pagination;
          const queryObj = req.queryObj;

          // Fetch total document count and paginated results
          const totalDocuments = await zomatoCollection.countDocuments(queryObj);
          const result = await zomatoCollection.find(queryObj).skip(skip).limit(limit).toArray();
          res.send({
              success: "Filters Applied Successfully",
              totalPages: Math.ceil(totalDocuments / limit),
              result,
          });
      } catch (Err) {
          res.status(500).send({ Error: `Error Occurred: ${Err}` });
      }
  }
);
// app.get("/restaurants", async (req,res) => {
//     try{
//         const page = parseInt(req.query.page) || 1; 
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;
        
//         const result = await zomatoCollection.find({}).skip(skip).limit(limit).toArray();
//         const totalRestaurants = await zomatoCollection.countDocuments();

//         res.status(200).send({success : "Restaurants List Sent Successfully", total:result.length,totalPages:Math.ceil(totalRestaurants/limit),result});
//     }
//     catch(Err){
//         res.status(404).send({Error : `Error Occurred while fetching list : ${Err}`})
//     }
// })

//API 5 : Filter Restaurants by Country
app.get("/restaurants/country/:countryName", async (req,res) => {
    try{
        
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
})

//API 6 : Filter Restaurants by Average Spend for Two People
app.get("/restaurants/avgexpenditure/:costRange", async (req,res) => {
    try{
        
        const result = await zomatoCollection.find({"Average Cost for two":{$lte:parseInt(req.params.costRange)}}).toArray();
        if(result.length>0)
        res.send({success : `Restaurants Sent Successfully`,result});
        else
        res.send({Error : `No Restaurants Found`});
        }
    catch(Err){
        res.send({Error : `Error Occurred : ${Err}`});
    }
})

//API 7 : Filter Restaurants by Cuisines 
app.get("/restaurants/cuisines/:cuisineName", async (req,res) => {
    try{
        
        const result = await zomatoCollection.find({ "Cuisines": { $in: [req.params.cuisineName] } }).toArray();
        if(result.length>0)
        res.send({success : `Restaurants in ${req.params.cuisineName} Sent Successfully`,result});
        else
        res.send({Error : `No Restaurants are Found with suggested Cuisine ${req.params.cuisineName}`});
    }
    catch(Err){
        res.send({Error : `Error Occurred : ${Err}`});
    }
})

//API 8 : Near by restaurants below 3 kms using latitude and longitude
app.post("/restaurants/getnearbyrestaurants", async (req, res) => {
    try {
      const { latitude, longitude,distance } = req.body;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      console.log("Received coordinates:", latitude, longitude,distance);
 
      const result1 = await zomatoCollection.find({
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude,latitude],  // Ensure [longitude, latitude] order
            },
            $maxDistance: distance*1000,  // Distance in meters (3 km)
          },
        },
      }).toArray();
      // Query to get restaurants within 3 km using geospatial query
      const result = await zomatoCollection.find({
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude,latitude],  // Ensure [longitude, latitude] order
            },
            $maxDistance: 3000,  // Distance in meters (3 km)
          },
        },
      }).limit(limit).toArray();  // Use .toArray() to get results from the cursor

  
      if (result.length > 0) {
        res.json({success:true,result,totalPages:Math.ceil(result1.length/limit)});  // Send the result as JSON
      } else {
        res.status(404).json({success:false, message: "No nearby restaurants found." });
      }
    } catch (err) {
      console.error("Error occurred:", err);  // Log the error
      res.status(500).json({ Error: `Error Occurred: ${err.message}` });  // Send the error message
    }
  });

//API 9 : Restaurants based on given image
app.post("/api/analyze-image", upload.single("image"),parseFilters,buildQuery, async (req, res) => {
    try {
      // Step 1: Get the uploaded file
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      let queryObj;
      if(req.queryObj)
        queryObj = req.queryObj;
      console.log(page);
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image uploaded." });
      }
      const imagePath = req.file.path;
  
      // Step 2: Convert image to Base64
      const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
  
      // Step 3: Send Base64 image to Clarifai
      const clarifaiResponse = await clarifaiApp.models.predict(
        Clarifai.GENERAL_MODEL, // Clarifai's General Model
        { base64: imageBase64 }
      );
      if(clarifaiResponse){
      const searchTags = (clarifaiResponse.outputs[0].data).concepts.map((ele) => ele.name);
      const searchConditions = searchTags.flatMap(tag => [
        { "Cuisines": { $elemMatch: { $regex: tag, $options: "i" } } }, // Case-insensitive match for cuisines
        { 
            "Restaurant Name": { $regex: tag, $options: "i" } } // Case-insensitive match for restaurant name
      ]);

      const result1 = await zomatoCollection.find({
        $and: [
          queryObj, // Static filters
          { $or: searchConditions }, // Dynamic filters from Clarifai tags
      ]
      }).toArray();
      
      // Final query with $or
      const result = await zomatoCollection.find({
        $and: [
            queryObj, // Static filters
            { $or: searchConditions }, // Dynamic filters from Clarifai tags
        ],
    }).skip(skip).limit(limit).toArray();
      
      
  
      // Step 4: Clean up temporary file
      fs.unlinkSync(imagePath); // Remove the uploaded image file from the server
  
      // Step 5: Return Clarifai response to client
      if(result.length>0){
      res.json({
        success: true,
        clarifaiResponse: clarifaiResponse.outputs[0].data,
        searchTags,
        result,
        totalPages:Math.ceil(result1.length/limit)
      });
      }
      else{
        res.json({success:false,clarifaiResponse:clarifaiResponse.outputs[0].data})
      }
      }
    } catch (error) {
      console.error("Error analyzing image:", error.message);
      res.status(500).json({ success: false, message: "Image processing failed.", error: error.message });
    }
  });


// app.get("/filteredrestaurants", async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         console.log(page);
//         const countryName = req.query.countryName;
//         const avgCostForTwoPeople = parseInt(req.query.avgCostForTwoPeople) || 0;
//         const cuisines = req.query.cuisines ? req.query.cuisines.split(',') : [];
//         const skip = (page - 1) * limit;
//         let queryObj = {};

//         if (countryName) {
//             queryObj["Country Code"] = parseInt(countryName);
//         }
//         if (avgCostForTwoPeople) {
//             queryObj["Average Cost for two"] = { $gte: avgCostForTwoPeople };
//         }

//         if (cuisines.length > 0 && cuisines[0] !== undefined) {
//             queryObj["Cuisines"] = { $in: cuisines };
//         }
        
//         // Fetching data from the collection
//         const totalPages = await zomatoCollection.countDocuments(queryObj);
//         const result = await zomatoCollection.find(queryObj).skip(skip).limit(limit).toArray();
//         res.send({ success: "Filters Applied Successfully", totalPages:Math.ceil(totalPages/limit),result });
//     } catch (Err) {
//         res.send({ Error: `Error Occurred: ${Err}` });
//     } 
// });






//API 5 : Filter Restaurants data by Country, Average Spend for Two People, Cuisines
// app.post("/restaurants", async (req,res) => {
//     console.log(req.body);
//     res.send({success : req.body});
// });

app.get("/cuisines", async (req,res) => {
    try{
        
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

// Added random restaurant API
app.get("/random", async (req,res) => {
    try{
        
        const count = await zomatoCollection.countDocuments(); 
        const randomIndex = Math.floor(Math.random() * count);
        const result = await zomatoCollection.find().skip(randomIndex).limit(1).toArray();
        res.status(200).send({success : "Restaurants List Sent Successfully",result});
    }
    catch(Err){
        res.status(404).send({Error : `Error Occurred while fetching list : ${Err}`});
    }
})



app.listen(3001,() => {
    console.log("Server is Running in http://localhost:3001");
})