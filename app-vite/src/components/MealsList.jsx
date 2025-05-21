import { useState, useEffect } from "react"


const MealsList = async () => {
    const [meals, setMeals] = useState([])

    useEffect(() => {
        async function fetchMeals() {
            const response = await fetch("http://localhost:3001/api/meals")
            const data = await response.json()
            setMeals(data)
        }
        fetchMeals();
    }, [])

    return (
        <div>
          {meals.map(meal => (
            <div key={meal.id}>
              <p>Title: {meal.title}</p>
              <p>Description: {meal.description}</p>
              <p>Price: {meal.price} €</p>
            </div>
          ))}
        </div>
      );
    };

export default MealsList;