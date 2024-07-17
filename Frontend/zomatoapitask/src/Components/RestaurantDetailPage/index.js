import "./index.css"
import { useParams } from "react-router-dom"

const RestaurantDetailPage = () => {
    const params = useParams();
    const {restaurantId} = params;
    console.log(restaurantId);
    return (
        <h1>{restaurantId}</h1>
    )
}

export default RestaurantDetailPage;