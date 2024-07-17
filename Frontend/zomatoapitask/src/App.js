import "./App.css"

const App = () => {
  // const [country, setCountry] = useState('');
  // const [avgcostoftwopeople, setAvgCostofTwoPeople] = useState('');
  // const [cuisines, setCuisines] = useState([]);

  const onSubmitForm = async () => {
    try{
      const options = {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          countrycode : 13,
          avgcostoftwopeople : 1200,
          cuisines : ["French", "Japanese", "Desserts"]          
        })
      }
      const response = await fetch('http://localhost:3001/restaurants',options);
      const data = await response.json()    
      console.log(data);
    }
    catch(Err){
      console.log(Err);
    }
  }

  return (
    <button onClick={onSubmitForm}>Submit</button>
  )
}

export default App;