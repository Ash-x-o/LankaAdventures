import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import marker from "./images/marker.png";

export default function SimpleMap() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResults, setShowResults] = useState([]);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const key = process.env.REACT_APP_TOKEN;
  const searchUrl = process.env.REACT_APP_SEARCH_URL;

  // Initialize map once
 useEffect(() => {
  if (!mapRef.current) {
        mapRef.current = L.map("map", {
        center: [7.0, 80.0],
        zoom: 7,
        scrollWheelZoom: true,
        });

        L.tileLayer(
        `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${key}`,
        {
            attribution:
            '<a href="https://locationiq.com/?ref=maps" target="_blank">© LocationIQ</a> <a href=\"https://openstreetmap.org/about/\" target=\"_blank\">© OpenStreetMap</a>',
            maxZoom: 18,
            id: "streets",
            key: key,
        }
        ).addTo(mapRef.current);
    }
    }, [key]);


  const doSearch = async (e) => {
    e.preventDefault();
    if (!searchValue) {
      alert("Please enter a location to search");
      return;
    }

    try {
      const url = `${searchUrl}key=${key}&q=${encodeURIComponent(searchValue)}&format=json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSearchResult(data);
      formatResults(data);
    } catch (err) {
      console.error("Error during fetch:", err);
      alert("An error occurred while searching. Please try again.");
    }
  };

  const formatResults = (results) => {
    const formatted = results.map((loc) => {
      const parts = loc.display_name.split(",");
      return {
        shortName: parts[0],
        fullAddress: loc.display_name,
        lat: parseFloat(loc.lat),
        lon: parseFloat(loc.lon),
      };
    });
    setShowResults(formatted);
  };

  const handleResultClick = (loc) => {
    // Move map to clicked location
    mapRef.current.setView([loc.lat, loc.lon], 13);

    // Remove previous marker
    if (markerRef.current) markerRef.current.remove();

    // Create a custom icon
    const customIcon = L.icon({
        iconUrl: marker, // replace with your image URL
        iconSize: [30, 30], // adjust size
        iconAnchor: [20, 40], // bottom-center of icon points to the location
        popupAnchor: [0, -40], // popup appears above the marker
    });

    // Add new marker with custom icon
    markerRef.current = L.marker([loc.lat, loc.lon], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup(loc.fullAddress)
        .openPopup();
  };

  return (
    <div>
      <form onSubmit={doSearch} style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter location"
          style={{ padding: "5px", width: "200px" }}
        />
        <button type="submit" style={{ padding: "5px 10px", marginLeft: "5px" }}>
          Search
        </button>
      </form>

      <div id="map" style={{ height: "400px", width: "400px", minHeight: "400px" }}></div>

      {showResults.map((result, index) => (
        <div
          key={index}
          style={{ cursor: "pointer", margin: "10px 0" }}
          onClick={() => handleResultClick(result)}
        >
          <h3>{result.shortName}</h3>
          <p>{result.fullAddress}</p>
        </div>
      ))}
    </div>
  );
}
