'use client'
import { useState, useEffect } from "react"


const MealsList = () => {
  const [meals, setMeals] = useState([])
  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await fetch("http://localhost:3001/api/meals");
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      }
    }
    fetchMeals()
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