import "./index.css"
import TextField from '@mui/material/TextField';
import { useState,useEffect } from "react";
import { ThreeDots } from 'react-loader-spinner';
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import { MenuItem, FormControl, Select, InputLabel, Chip, Box, Button } from '@mui/material';


const countries = {
    "" : null,
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
const cuisinesList = ["Mughalai","Chinese","Japanese","French"];


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
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedAvgCostForTwo, setSelectedAvgCostForTwo] = useState('');

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

    const applyFilters = async (countryName,avgCostForTwoPeople,cuisinesString) => {
        try{
            const response = await fetch(`http://localhost:3001/filteredrestaurants?page=${page}&limit=${limit}&countryName=${countries[countryName]}&avgCostForTwoPeople=${avgCostForTwoPeople}&cuisines=${cuisinesString}`)
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


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/restaurants?page=${page}&limit=${limit}`)
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
            } catch (err) {
                console.log(`Error Occurred : ${err}`);
                setIsLoading(false);  // Make sure to set loading to false even if there's an error
            }
        };
    
        fetchData();
    }, [page, limit]);

    

    const filteredData = restaurantsList.filter((restaurant) => {
        const restaurantNameMatch = restaurant.restaurantName.toLowerCase().includes(searchInput.toLowerCase());
        const cuisinesMatch = restaurant.cuisines.some(cuisine => 
          cuisine.toLowerCase().includes(searchInput.toLowerCase())
        );
        return restaurantNameMatch || cuisinesMatch;
      });
      

    const handlePageChange = (event, value) => {
        setPage(value);
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
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
                </div>
                <ul className="restaurants-list-container">
                    {filteredData.map((ele,index) => (
                        <li key={index} className="restaurant-card">
                            <Link className="link-tag" to={`/restaurants/${ele.country}/${ele.restaurantId}`}>
                            <div>
                                <img src={ele.imageUrl} alt="restaurant-image" className="restaurant-image"/>
                                <div className="flex-container1">
                                <p>{ele.restaurantName}</p>
                                <p className="rating">{ele.aggregateRating}</p>
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