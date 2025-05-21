import Link from "next/link";
export default async function MealDetails({ params }) {
    const response = await fetch(`http://localhost:3001/api/meals/${params.mealsId}`)
    const meal = await response.json();
    const cleanedTitle = meal.title.replace(/\s/g, '');
    return (
        <div>

            <Link
                href={{
                    pathname: `/reservation/reserve-meal-${cleanedTitle}`,
                    query: { 
                        title: meal.title, 
                        id: meal.id, 
                        amount: meal.max_reservations, 
                        price: meal.price, 
                        date: meal.when 
                    },
                }}
            ><h1>{meal.title}</h1>
                <p>{meal.description}</p></Link>
        </div>
    );
}