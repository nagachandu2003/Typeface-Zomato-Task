import "./index.css"
import TextField from '@mui/material/TextField';
import { useState } from "react";
import { ThreeDots } from 'react-loader-spinner';
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import { MenuItem, FormControl, Select, InputLabel, Chip, Box, Button } from '@mui/material';
import { FaStar } from "react-icons/fa";
import {Avatar, Slider, Typography } from "@mui/material";


const countries = {
    "1": "India",
    "14": "Australia",
    "30": "Brazil",
    "37": "Canada",
    "94": "Indonesia",
    "148": "New Zealand",
    "162": "Philippines",
    "166": "Qatar",
    "184": "Singapore",
    "189": "South Africa",
    "191": "Sri Lanka",
    "208": "Turkey",
    "214": "UAE",
    "215": "United Kingdom",
    "216": "United States",
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

const countriesList = [
    "Australia",
    "Brazil",
    "Canada",
    "India",
    "Indonesia",
    "New Zealand",
    "Philippines",
    "Qatar",
    "Singapore",
    "South Africa",
    "Sri Lanka",
    "Turkey",
    "UAE",
    "United Kingdom",
    "United States"
  ];

const avgCostForTwoList = [0,350,750,1500]
const cuisinesList = [
    "Afghani",
        "African",
        "American",
        "Andhra",
        "Arabian",
        "Argentine",
        "Armenian",
        "Asian",
        "Asian Fusion",
        "Assamese",
        "Australian",
        "Awadhi",
        "BBQ",
        "Bakery",
        "Bar Food",
        "Belgian",
        "Bengali",
        "Beverages",
        "Bihari",
        "Biryani",
        "Brazilian",
        "Breakfast",
        "British",
        "Bubble Tea",
        "Burger",
        "Burmese",
        "B�_rek",
        "Cafe",
        "Cajun",
        "Canadian",
        "Cantonese",
        "Caribbean",
        "Charcoal Grill",
        "Chettinad",
        "Chinese",
        "Coffee and Tea",
        "Contemporary",
        "Continental",
        "Cuban",
        "Cuisine Varies",
        "Curry",
        "Deli",
        "Desserts",
        "Dim Sum",
        "Diner",
        "Drinks Only",
        "Durban",
        "D�_ner",
        "European",
        "Fast Food",
        "Filipino",
        "Finger Food",
        "Fish and Chips",
        "French",
        "Fusion",
        "German",
        "Goan",
        "Gourmet Fast Food",
        "Greek",
        "Grill",
        "Gujarati",
        "Hawaiian",
        "Healthy Food",
        "Hyderabadi",
        "Ice Cream",
        "Indian",
        "Indonesian",
        "International",
        "Iranian",
        "Irish",
        "Italian",
        "Izgara",
        "Japanese",
        "Juices",
        "Kashmiri",
        "Kebab",
        "Kerala",
        "Kiwi",
        "Korean",
        "Latin American",
        "Lebanese",
        "Lucknowi",
        "Maharashtrian",
        "Malay",
        "Malaysian",
        "Malwani",
        "Mangalorean",
        "Mediterranean",
        "Mexican",
        "Middle Eastern",
        "Mineira",
        "Mithai",
        "Modern Australian",
        "Modern Indian",
        "Moroccan",
        "Mughlai",
        "Naga",
        "Nepalese",
        "New American",
        "North Eastern",
        "North Indian",
        "Oriya",
        "Pakistani",
        "Parsi",
        "Patisserie",
        "Peranakan",
        "Persian",
        "Peruvian",
        "Pizza",
        "Portuguese",
        "Pub Food",
        "Rajasthani",
        "Ramen",
        "Raw Meats",
        "Restaurant Cafe",
        "Salad",
        "Sandwich",
        "Scottish",
        "Seafood",
        "Singaporean",
        "Soul Food",
        "South African",
        "South American",
        "South Indian",
        "Southern",
        "Southwestern",
        "Spanish",
        "Sri Lankan",
        "Steak",
        "Street Food",
        "Sunda",
        "Sushi",
        "Taiwanese",
        "Tapas",
        "Tea",
        "Teriyaki",
        "Tex-Mex",
        "Thai",
        "Tibetan",
        "Turkish",
        "Turkish Pizza",
        "Vegetarian",
        "Vietnamese",
        "Western",
        "World Cuisine"
];


const imageUrls = [
    'https://b.zmtcdn.com/data/pictures/7/2800057/7bfe535ceaae0b4082bd54fc775fb910_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/5/18899835/28817e9aae3795b5ba3f122d1f003903_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/chains/0/18837140/cddf8893dc7c751506af12007b3314c2_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/7/2800007/850cd431b96f2a9b69cbdd0f101ad7e0_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/4/2800044/28d73f8de29aab9729abd88df4de2932_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/0/19065540/11645e180a8ef13c2a5cac4dcf77e80b_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/2/2800052/572cb90f452612793948d2fd042f5789_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/9/20971929/18ca7665fb539e59ae61ce8ae8290bb7_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/2/2800042/c7559afa7bc5777b53b1c95149ca91a9_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/2/20740522/a477882efc52fad2e4bed55ea7f0e514_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/5/20337975/0642f72c764b934899f2183db349933e_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/8/20674118/0d4721484269002c17eb328ae886919d_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/9/2800059/f6187ea0be79d73bf3e59afcba29f5c8_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/chains/7/18377597/d22156fcfcbbbd9be2015d1a7dcc5ad0_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/2/18433622/c9d1be169e9def4cc97d889d346eb380_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/2/2801682/be7b79147255b40c52b11162e615bb75_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/3/2800903/84bb43d538698bee50e33b6a99e66927_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/3/2800053/cefcee305221e59bfe2f845e74e3b8f3_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/5/20440935/d27d608c67c98a26b7c46ebe0509c515_featured_v2.jpg',
    'https://b.zmtcdn.com/data/pictures/0/2801690/637c1007a4b797c5218e45e6d319fb92_featured_v2.jpg'
]

const Home = ()  => {
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [restaurantsList, setRestaurantsList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedAvgCostForTwo, setSelectedAvgCostForTwo] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [distance, setDistance] = useState(10);
    const [image, setImage] = useState();
    const [preview,setPreview] = useState();
    const [isImageUploadActive, setIsImageUploadActive] = useState(false);
    const [isLocationSearchActive, setIsLocationSearchActive] = useState(false);
    const [isAllRestaurantsActive, setIsAllRestaurantsActive] = useState(false);

    const handleCuisineChange = (event) => {
        setSelectedCuisines(event.target.value);
    };

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    const handleAvgCostForTwoChange = (event) => {
        setSelectedAvgCostForTwo(event.target.value);
    };

    const getRandomItem = () => {
        const imageLink = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        return imageLink
    }

    const clearFilters = () => {
        setSelectedCountry('');
        setSelectedCuisines([]);
        setSelectedAvgCostForTwo('');
        applyFilters('','','');
        setPage(1);
    }

    const applyFilters = async (countryName,avgCostForTwoPeople,cuisinesString) => {
        try{
            if(isImageUploadActive){
                await handleSubmitImage(page);
            }
            else if(isLocationSearchActive){
                await searchByLocation(latitude,longitude,page);
            }
            else if(isAllRestaurantsActive){
            let apiurl = `http://localhost:3001/restaurants?page=${page}&limit=${limit}&countryName=${countries[countryName]}&avgCostForTwoPeople=${avgCostForTwoPeople}&cuisines=${cuisinesString}`;
            const response = await fetch(apiurl)
            const data = await response.json();
            const finalData = data.result.map((ele) => ({
                id: ele["_id"],
                restaurantId: ele["Restaurant ID"],
                restaurantName: ele["Restaurant Name"],
                countryCode: ele["Country Code"],
                city: ele["City"],
                address: ele["Address"],
                locality: ele["Locality"],
                localityVerbose: ele["Locality Verbose"],
                longitude: ele["Longitude"],
                latitude: ele["Latitude"],
                cuisines: ele["Cuisines"],
                avgCostForTwo: ele["Average Cost for two"],
                currency: ele["Currency"],
                hasTableBooking: ele["Has Table booking"],
                hasOnlineDelivery: ele["Has Online delivery"],
                isDeliveringNow: ele["Is delivering now"],
                switchToOrderMenu: ele["Switch to order menu"],
                priceRange: ele["Price range"],
                aggregateRating: ele["Aggregate rating"],
                ratingColor: ele["Rating color"],
                ratingText: ele["Rating text"],
                votes: ele["Votes"],
                country : countries[ele["Country Code"]],
                imageUrl : getRandomItem()
            }));
            setRestaurantsList(finalData);
            setTotalPages(data.totalPages);
        }
        }
        catch(Err){
            console.log(`Error Occurred : ${Err}`);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const countryName = selectedCountry;
        const avgCostForTwoPeople = selectedAvgCostForTwo;
        const cuisinesString = selectedCuisines.join(',');
        applyFilters(countryName,avgCostForTwoPeople,cuisinesString)
    }
    const handleSubmitImage = async (val) => {
        try {
            setIsLoading(true)
            const formData = new FormData();
            formData.append("image", image); // "image" is the field name expected by the backend API
        
            // Send the image to the backend
            const response = await fetch(`http://localhost:3001/api/analyze-image?page=${val}&limit=${limit}&countryName=${countries[selectedCountry]!==undefined?countries[selectedCountry]:selectedCountry}&avgCostForTwoPeople=${selectedAvgCostForTwo}&cuisines=${selectedCuisines.join(",")}`, {
              method: "POST",
              body: formData,
            });
        
            if (!response.ok) {
              throw new Error("Failed to upload image.");
            }
        
            const data = await response.json();
            const finalData = data.result.map((ele) => ({
                id: ele["_id"],
                restaurantId: ele["Restaurant ID"],
                restaurantName: ele["Restaurant Name"],
                countryCode: ele["Country Code"],
                city: ele["City"],
                address: ele["Address"],
                locality: ele["Locality"],
                localityVerbose: ele["Locality Verbose"],
                longitude: ele["Longitude"],
                latitude: ele["Latitude"],
                cuisines: ele["Cuisines"],
                avgCostForTwo: ele["Average Cost for two"],
                currency: ele["Currency"],
                hasTableBooking: ele["Has Table booking"],
                hasOnlineDelivery: ele["Has Online delivery"],
                isDeliveringNow: ele["Is delivering now"],
                switchToOrderMenu: ele["Switch to order menu"],
                priceRange: ele["Price range"],
                aggregateRating: ele["Aggregate rating"],
                ratingColor: ele["Rating color"],
                ratingText: ele["Rating text"],
                votes: ele["Votes"],
                country : countries[ele["Country Code"]],
                imageUrl : getRandomItem()
            }));
            setTotalPages(data.totalPages);
            setRestaurantsList(finalData);
            setIsImageUploadActive(true);
            setIsLocationSearchActive(false);
            setIsAllRestaurantsActive(false);
            setIsLoading(false);

          } catch (error) {
            console.error("Error in uploadImageToClarifai:", error.message);
          }
    }
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setImage(file);
          setPreview(URL.createObjectURL(file)); // Create preview URL
        }
      };

    const searchByLocation = async (lat,lon,val) => {
        try {
            setIsLoading(true);
            const options = {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({latitude:lat,longitude:lon,distance})
            }
            const response = await fetch(`http://localhost:3001/restaurants/getnearbyrestaurants?page=${val}&limit=${limit}&countryName=${countries[selectedCountry]!==undefined?countries[selectedCountry]:selectedCountry}&avgCostForTwoPeople=${selectedAvgCostForTwo}&cuisines=${selectedCuisines.join(",")}`,options);
            const data = await response.json();
            if(data.success){
                const finalData = data.result.map((ele) => ({
                    id: ele["_id"],
                    restaurantId: ele["Restaurant ID"],
                    restaurantName: ele["Restaurant Name"],
                    countryCode: ele["Country Code"],
                    city: ele["City"],
                    address: ele["Address"],
                    locality: ele["Locality"],
                    localityVerbose: ele["Locality Verbose"],
                    longitude: ele["Longitude"],
                    latitude: ele["Latitude"],
                    cuisines: ele["Cuisines"],
                    avgCostForTwo: ele["Average Cost for two"],
                    currency: ele["Currency"],
                    hasTableBooking: ele["Has Table booking"],
                    hasOnlineDelivery: ele["Has Online delivery"],
                    isDeliveringNow: ele["Is delivering now"],
                    switchToOrderMenu: ele["Switch to order menu"],
                    priceRange: ele["Price range"],
                    aggregateRating: ele["Aggregate rating"],
                    ratingColor: ele["Rating color"],
                    ratingText: ele["Rating text"],
                    votes: ele["Votes"],
                    country : countries[ele["Country Code"]],
                    imageUrl : getRandomItem()
                }));
                setRestaurantsList(finalData);
                setTotalPages(data.totalPages);
                setIsImageUploadActive(false);
                setIsLocationSearchActive(true);
                setIsAllRestaurantsActive(false);
                setIsLoading(false);
            }
            else if(data.success===false){
                setRestaurantsList([]);
                setTotalPages(0);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleSearchLocation =  () => {
        if ("geolocation" in navigator) {
            // Geolocation is available in this browser
            navigator.geolocation.getCurrentPosition(
              (position) => {
                searchByLocation(position.coords.latitude,position.coords.longitude)
              },
              async (error) => {
                const response = await fetch("https://ipapi.co/json/");
                const data = await response.json();
                console.log(data.latitude,data.longitude);
                searchByLocation(data.latitude,data.longitude,page);
                // console.log(error);
                }
            );
          } else {
            alert("Geolocation is not supported by this browser.");
          }
    }

    const getAllRestaurants = async (val) => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/restaurants?page=${val}&limit=${limit}&countryName=${countries[selectedCountry]!==undefined?countries[selectedCountry]:selectedCountry}&avgCostForTwoPeople=${selectedAvgCostForTwo}&cuisines=${selectedCuisines.join(",")}`)
                const data = await response.json();
                const finalData = data.result.map((ele) => ({
                    id: ele["_id"],
                    restaurantId: ele["Restaurant ID"],
                    restaurantName: ele["Restaurant Name"],
                    countryCode: ele["Country Code"],
                    city: ele["City"],
                    address: ele["Address"],
                    locality: ele["Locality"],
                    localityVerbose: ele["Locality Verbose"],
                    longitude: ele["Longitude"],
                    latitude: ele["Latitude"],
                    cuisines: ele["Cuisines"],
                    avgCostForTwo: ele["Average Cost for two"],
                    currency: ele["Currency"],
                    hasTableBooking: ele["Has Table booking"],
                    hasOnlineDelivery: ele["Has Online delivery"],
                    isDeliveringNow: ele["Is delivering now"],
                    switchToOrderMenu: ele["Switch to order menu"],
                    priceRange: ele["Price range"],
                    aggregateRating: ele["Aggregate rating"],
                    ratingColor: ele["Rating color"],
                    ratingText: ele["Rating text"],
                    votes: ele["Votes"],
                    country : countries[ele["Country Code"]],
                    imageUrl : getRandomItem()
                }));
                setTotalPages(data.totalPages);
                setRestaurantsList(finalData);  // Use finalData instead of data.result
                setIsLoading(false);
                setIsImageUploadActive(false);
                setIsLocationSearchActive(false);
                setIsAllRestaurantsActive(true);
            } catch (err) {
                console.log(`Error Occurred : ${err}`);
                setIsLoading(false);  // Make sure to set loading to false even if there's an error
            }
        };

    

    const filteredData = restaurantsList.filter((restaurant) => {
        const restaurantNameMatch = restaurant.restaurantName.toLowerCase().includes(searchInput.toLowerCase());
        const cuisinesMatch = restaurant.cuisines.some(cuisine => 
          cuisine.toLowerCase().includes(searchInput.toLowerCase())
        );
        return restaurantNameMatch || cuisinesMatch;
      });
      

    const handlePageChange = async (event, value) => {
        setPage(value);
        if (isImageUploadActive) {
            await handleSubmitImage(value); // Call the image upload function for the new page
          } else if (isLocationSearchActive) {
            searchByLocation(latitude,longitude,value); // Example coordinates, replace with dynamic ones
          }
          else if(isAllRestaurantsActive){
            getAllRestaurants(value);
          }
    };

    return (
        <>
        <div className="landing-page">
            <div className="landing-card">
                <h1 className="main-heading1">Zomato</h1>
                <p className="paragraph1">Discover the best food & drinks</p>
                <TextField
                id="filled-search"
                label="Search For Restaurant or Cuisine"
                type="search"
                variant="filled"
                sx={{ backgroundColor: 'white' }}
                className="search-input"
                onChange={(e) => setSearchInput(e.target.value)}
                />
                
                {/* <div style={{width:'90%'}}>
                    <div>
                <div style={{marginTop:'10px',width:'90%',display:'flex',}}>
                <TextField
                id="filled-search"
                label="Latitude"
                type="search"
                variant="filled"
                sx={{ backgroundColor: 'white',width:'30%' }}
                className="search-input"
                onChange={(e) => setLatitude(e.target.value)}
                />
                <TextField
                id="filled-search"
                label="Longitude"
                type="search"
                variant="filled"
                sx={{ backgroundColor: 'white', width:'30%' }}
                className="search-input"
                onChange={(e) => setLongitude(e.target.value)}
                />
            <Button variant="contained" style={{marginTop:'5px',backgroundColor:'white',color:'black'}} onClick={() => searchByLocation(parseFloat(latitude),parseFloat(longitude))}>
                Search
            </Button>
            </div>
            </div>
            </div> */}
            <div style={{marginTop:'10px',width:'50%', display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <Button type="button" variant="contained" color="primary" onClick={getAllRestaurants}>
                Get All Restaurants
            </Button>
                <Button type="button" variant="contained" style={{marginTop:'5px',backgroundColor:'white',color:'black'}} onClick={handleSearchLocation}>
                Get Near by Restaurants
            </Button>
            </div>
            </div>
        </div>
            <div>
            {isLoading===true && (
                <div className="loader-container">
                    <ThreeDots
                    height="80"
                    width="80"
                    radius="5"
                    color="grey"
                    ariaLabel="three-dots-loading"
                    visible={true}
                    />
                </div>
            )}
            {isLoading===false && (
                <div className="restaurants-list">
                    <div className="filters-container">
                        <h1>Features</h1>
                        <div className="flex-container3">
                        <Box
                        sx={{
                            maxWidth: 400,
                            margin: "auto",
                            display: "flex",
                            flexGrow:1,
                            flexDirection: "column",
                            gap: 2,
                            p: 3,
                            boxShadow: 2,
                            borderRadius: 2,
                            backgroundColor:'white'
                        }}
                        >
                        <Typography color="black" variant="h5" align="center" gutterBottom>
                            Find Restaurants
                        </Typography>

                        {/* Latitude Input */}
                        <TextField
                            label="Latitude"
                            variant="outlined"
                            fullWidth
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            type="number"
                            inputProps={{ step: "any" }} // Allows decimals
                        />

                        {/* Longitude Input */}
                        <TextField
                            label="Longitude"
                            variant="outlined"
                            fullWidth
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            type="number"
                            inputProps={{ step: "any" }} // Allows decimals
                        />

                        {/* Range Slider */}
                        <Typography id="range-slider" gutterBottom>
                            Distance: {distance} km
                        </Typography>
                        <Slider
                            value={distance}
                            min={10} // Minimum 10 km
                            max={50} // Maximum 50 km
                            step={1}
                            onChange={(e,newval) => setDistance(newval)}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                        />
                        <Button type="button" variant="contained" color="primary" onClick={() => searchByLocation(parseFloat(latitude),parseFloat(longitude))}>
                            Search
                        </Button>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                flexGrow:1,
                                gap: 2,
                                p: 3,
                                boxShadow: 2,
                                borderRadius: 2,
                                maxWidth: 400,
                                margin: "auto",
                            }}
                            >
                            <Typography variant="h5" gutterBottom>
                                Upload Food Image
                            </Typography>

                            {/* Image Preview */}
                            {preview ? (
                                <Avatar
                                src={preview}
                                alt="Food Preview"
                                sx={{ width: 150, height: 150, borderRadius: 2 }}
                                />
                            ) : (
                                <Avatar
                                sx={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: 2,
                                    backgroundColor: "#f0f0f0",
                                }}
                                >
                                <Typography variant="caption">No Image</Typography>
                                </Avatar>
                            )}

                            {/* Upload Button */}
                            <Button variant="contained" component="label" color="primary">
                                Choose Image
                                <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                                />
                            </Button>

                            {/* Display Image File Name */}
                            {image && (
                                <Typography variant="body2" color="textSecondary">
                                {image.name}
                                </Typography>
                            )}
                            <Button type="button" variant="contained" color="primary" onClick={() => handleSubmitImage(page)}>
                                            Submit
                            </Button>
                            </Box>
                        </div>
                    </div>
                <div className="filters-container">
                    <h1>Filters</h1>
                    <div className="filters-form-container">
                <FormControl  fullWidth>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                        labelId="country-label"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                    >
                        {countriesList.map((country) => (
                            <MenuItem key={country} value={country}>
                                {country}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="avg-cost-for-two-label">Avg Cost for Two</InputLabel>
                    <Select
                        labelId="avg-cost-for-two-label"
                        value={selectedAvgCostForTwo}
                        onChange={handleAvgCostForTwoChange}
                    >
                        {avgCostForTwoList.map((cost) => (
                            <MenuItem key={cost} value={cost}>
                                {cost}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="cuisines-label">Cuisines</InputLabel>
                    <Select
                        labelId="cuisines-label"
                        multiple
                        value={selectedCuisines}
                        onChange={handleCuisineChange}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {cuisinesList.map((cuisine) => (
                            <MenuItem key={cuisine} value={cuisine}>
                                {cuisine}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                </div>
            <Button type="button" variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
            <Button style={{marginLeft:'5px'}} type="button" variant="contained" color="secondary" onClick={() => clearFilters()}>
                                            Clear Filters
            </Button>
                </div>
                <ul className="restaurants-list-container">
                    {filteredData.length===0 && (
                        <h1>No restaurants Found</h1>
                    )}
                    {filteredData.length!==0 && filteredData.map((ele,index) => (
                        <li key={index} className="restaurant-card">
                            <Link className="link-tag" to={`/restaurants/${ele.country}/${ele.restaurantId}`} target="_blank">
                            <div>
                                <img src={ele.imageUrl} alt="restaurant-image" className="restaurant-image"/>
                                <div className="flex-container1">
                                <p style={{width:'50%'}}>{ele.restaurantName}</p>
                                <p style={{width:'20%'}} className="rating">{ele.aggregateRating} <FaStar/></p>
                                </div>
                                <div className="flex-container2">
                                <p className="address">{ele.address.substring(0, 20) + "..."}</p>
                                <p className="avg-two">{ele.avgCostForTwo} for two</p>
                                </div>
                            </div>
                            </Link>
                        </li>))}
                </ul>
                <div className="pagination-container">
                    <Pagination 
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    />
                </div>
                </div>
            )}
        </div>
                </>
    )
}

export default Home;