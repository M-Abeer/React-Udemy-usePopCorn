import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import "./StarRating";
import StarRating from "./StarRating";

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <>
      <StarRating
        maxRating={8}
        size={24}
        color="blue"
        onSetRating={setMovieRating}
      />
      <p>THis movie has {movieRating} rating</p>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating maxRating={10} />
    <StarRating
      maxRating={5}
      size={20}
      color="red"
      message={["bad", "normal", "average", "good", "excellent"]}
    />

    <StarRating maxRating={6} color="green" size={24} />
    <Test />
    {/* <StarRating maxRating={5} />
    <StarRating /> */}
  </React.StrictMode>
);
