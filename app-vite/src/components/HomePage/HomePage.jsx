import React from "react";
import hyfLogo from "../../assets/hyf.svg";
import "./HomePage.css";
import MealsList from "../MealsList";

// Feel free to replace the content of this component with your own
function HomePage() {
  return (
    <>
      {/* <a href="https://www.hackyourfuture.dk/" target="_blank" className="link">
        <img src={hyfLogo} alt="HackYourFuture logo" className="logo" />
      </a> */}
      <MealsList />
      {/* <a href="/nested" className="link">
        <span className="message">Go to the nested page</span>
      </a> */}
    </>
  );
}

export default HomePage;
