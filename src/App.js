

import React from "react";
import { Helmet } from "react-helmet"; // Import Helmet for managing head
import Weather from "./Weather";
import './App.css'; // Optional for global styles

function App() {
    return (
        <div className="App">
            {/* Meta Tags for SEO */}
            <Helmet>
                <title>The Weather Channel - Real-Time Weather Updates</title>
                <meta name="description" content="Get real-time weather updates and forecasts for your location with The Weather Channel app." />
                <meta name="keywords" content="weather, forecast, real-time weather, weather app" />
                <meta name="author" content="Your Name" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>

            <Weather />
        </div>
    );
}

export default App;


