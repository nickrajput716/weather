import React, { useState } from "react";
import "./App.css";
import logo from './logo.jpg';

function WeatherHeader({ onSearch, onLogin }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  return (
    <div className="header">
      <div className="logo">
        <img className="img" src={logo} alt="Weather Logo" />
        <span>Now Weather</span>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search City Name"
          className="search-input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          🔍
        </button>
      </div>
      <button className="login-btn" onClick={onLogin}>Login</button>
    </div>
  );
}

function WeatherNavBar() {
  return (
    <div className="nav-bar">
      <button className="nav-item">My Dashboard</button>
      <button className="nav-item">Today</button>
      <button className="nav-item">Weekend</button>
      <button className="nav-item">Monthly</button>
      <div className="dropdown">
        <button className="nav-item">More Forecasts ▼</button>
      </div>
    </div>
  );
}

function WeatherCard({ time, temperature, humidity, windSpeed }) {
  return (
    <div className="weather-card">
      <h2>{time}</h2>
      <div className="weather-details">
        <p>Temperature: {temperature}°C</p>
        <p>Humidity: {humidity}%</p>
        <p>Wind Speed: {windSpeed} m/s</p>
      </div>
    </div>
  );
}

function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function WeatherApp() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f204c52e8795ec52573613ae36064959`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const formattedData = [
        {
          time: new Date().toLocaleString(),
          temperature: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
        },
      ];
      setWeatherData(formattedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (username, password) => {
    // Send login request to backend
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          // Store token in localStorage
          localStorage.setItem("authToken", data.token);
          setIsAuthenticated(true);
          setShowLoginForm(false);
        } else {
          alert("Login failed: " + data.message);
        }
      })
      .catch((error) => {
        alert("Login error: " + error.message);
      });
  };

  const handleLogout = () => {
    // Clear token and logout user
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <div className="app">
      <WeatherHeader
        onSearch={fetchWeatherData}
        onLogin={() => setShowLoginForm(!showLoginForm)}
      />
      {showLoginForm && <LoginForm onSubmit={handleLogin} />}

      {isAuthenticated ? (
        <div>
          <WeatherNavBar />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p></p>
      )}

      <div className="main-content">
        {loading ? (
          <p>Loading weather data...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : weatherData.length > 0 ? (
          weatherData.map((data, index) => (
            <WeatherCard
              key={index}
              time={data.time}
              temperature={data.temperature}
              humidity={data.humidity}
              windSpeed={data.windSpeed}
            />
          ))
        ) : (
          <p>Search for a city to display weather data.</p>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
