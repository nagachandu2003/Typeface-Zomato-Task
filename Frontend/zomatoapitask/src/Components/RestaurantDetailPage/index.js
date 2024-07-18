import "./index.css"
import { useParams } from "react-router-dom"
import {useState, useEffect} from 'react'
import { ThreeDots } from "react-loader-spinner"
import { SiGooglemaps } from "react-icons/si";
import { FaStar } from "react-icons/fa";

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

const RestaurantDetailPage = () => {
    // Getting Restaurant Id from paramters
    const params = useParams();
    const {countryName,restaurantId} = params;
    
    const [restaurantDetails, setRestaurantDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const getRandomItem = () => {
        const imageLink = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        return imageLink
    }
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/restaurants/${restaurantId}`);
                const data = await response.json();
                const ele = data.result;
                const finalData =  {
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
                    cuisines: ele["Cuisines"].join(", "),
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
                    imageUrl : getRandomItem()
                };
                setRestaurantDetails(finalData);  // Use finalData instead of data.result
                setIsLoading(false);
            } catch (err) {
                console.log(`Error Occurred : ${err}`);
                setIsLoading(false);  // Make sure to set loading to false even if there's an error
            }
        };
    
        fetchData();
    }, [restaurantDetails.restaurantId]);

    return (
        <div className="main-container-rdp">
            <div className="navcontainer">
                <h1 className="main-heading1-rdp">Zomato</h1>
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
                    <div className="restaurant-detail-container">
                        <div className="details-container">
                        <img className="image-rdp" src={restaurantDetails.imageUrl} alt={restaurantDetails.restaurantName}/>
                        <div className="flex-container1">
                        <h1>Name : {restaurantDetails.restaurantName} <a href={`https://www.google.com/maps?q=${restaurantDetails.latitude},${restaurantDetails.longitude}`} target="_blank" rel="noreferrer"><SiGooglemaps className="icon"/></a></h1>
                        <p className="rating">{restaurantDetails.aggregateRating} <FaStar/></p>
                        </div>
                        <div style={{display:'flex',justifyContent:'space-between'}}>
                        <h2 style={{backgroundColor:'green',color:'yellow',padding:'10px',borderRadius:'8px'}}>Cuisines : {restaurantDetails.cuisines}</h2>
                        <p>Votes : {restaurantDetails.votes}</p>
                        </div>
                        <div className="flex-container2">
                        <div>
                        <h2>Country : {countryName}</h2>
                        <h2>City : {restaurantDetails.city}</h2>
                        <h3>Address : {restaurantDetails.address}</h3>
                        <h4>Average Order for Two : {restaurantDetails.avgCostForTwo}</h4>
                        <h4>Currency : {restaurantDetails.currency}</h4>
                        </div>
                    <ul className="list-container-rdp">
                    <li className="list-item">Locality: {restaurantDetails.locality}</li>
                    <li className="list-item">Locality Verbose: {restaurantDetails.localityVerbose}</li>
                    <li className="list-item">Has Table booking: {restaurantDetails.hasTableBooking ? 'Yes' : 'No'}</li>
                    <li className="list-item">Has Online delivery: {restaurantDetails.hasOnlineDelivery ? 'Yes' : 'No'}</li>
                    <li className="list-item">Is delivering now: {restaurantDetails.isDeliveringNow ? 'Yes' : 'No'}</li>
                    <li className="list-item">Switch to order menu: {restaurantDetails.switchToOrderMenu ? 'Yes' : 'No'}</li>
                    <li className="list-item">Price range: {restaurantDetails.priceRange}</li>
                    </ul>
                    </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RestaurantDetailPage;