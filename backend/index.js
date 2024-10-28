const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/search', async (req, res) => {
    const { location } = req.body;

    try {
        // Get lat/lng from Nominatim API
        const geoResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
        );

        if (geoResponse.data.length === 0) {
            return res.status(404).json({ message: "Location not found" });
        }

        const { lat, lon } = geoResponse.data[0];

        // Fetch nearby amenities using Overpass API
        const overpassQuery = `
            [out:json];
            (
                node(around:1000,${lat},${lon})[amenity=school];
                node(around:1000,${lat},${lon})[amenity=marketplace];
                node(around:1000,${lat},${lon})[amenity=bus_station];
                node(around:1000,${lat},${lon})[shop];
            );
            out;
        `;
        const overpassResponse = await axios.get(
            `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
        );

        const results = overpassResponse.data.elements.map((element) => ({
            name: element.tags.name || "Unnamed",
            type: element.tags.amenity || element.tags.shop,
            lat: element.lat,
            lon: element.lon,
        }));

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching data" });
    }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
