import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import cors from "cors";

import ReactDOM from "react-dom/client";

//make a button when clicked makes request to api at localhost:6000
//write function to make request to api
//use axios to make request
function fetchData() {
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  axios
    .get("http://localhost:8000/login")
    .then((response) => {
      console.log(response.data);
      const container = document.getElementById("root");
      const root = ReactDOM.createRoot(container);
      root.render(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function App() {
  return (
    <>
      <h1>Spotify</h1>
      <button href="http://localhost:8000/login">Get Data</button>
      <a href="http://localhost:8000/login">Data</a>
    </>
  );
}

export default App;
