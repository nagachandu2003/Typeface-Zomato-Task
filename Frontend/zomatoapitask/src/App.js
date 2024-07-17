import "./App.css"
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from "./Components/Home";
import RestaurantDetailPage from "./Components/RestaurantDetailPage";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home/>}/>
      <Route exact path="/restaurants/:countryName/:restaurantId" element={<RestaurantDetailPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;