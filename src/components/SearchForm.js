import React, { useState } from 'react';
import axios from 'axios';

const SearchForm = () => {
    const [location, setLocation] = useState('');
    const [results, setResults] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/search', { location });
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location (street, number, city)"
                />
                <button type="submit">Search</button>
            </form>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>{result.name} - {result.type}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchForm;
