import React, { useState, useEffect } from 'react';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');
  const [results, setResults] = useState([]);

  // fake data
  const mockItems = [
    { id: 1, name: 'Used Laptop', price: 500, condition: 'Good', type: 'Electronics' },
    { id: 2, name: 'Vintage Chair', price: 150, condition: 'Excellent', type: 'Furniture' },
    { id: 3, name: 'Second-hand Bike', price: 200, condition: 'Fair', type: 'Sports' },
    // more listing
  ];

  // search function
  const handleSearch = () => {
    let filteredItems = mockItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    // filter
    if (filters.minPrice) {
      filteredItems = filteredItems.filter(item => item.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filteredItems = filteredItems.filter(item => item.price <= filters.maxPrice);
    }
    if (filters.type) {
      filteredItems = filteredItems.filter(item => item.type === filters.type);
    }

    // listing the item
    if (sort === 'price_asc') {
      filteredItems.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filteredItems.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      filteredItems.sort((a, b) => b.id - a.id); // assume the newest item have greater id
    }

    setResults(filteredItems);
  };

  useEffect(() => {
    handleSearch();
  }, [query, filters, sort]);

  return (
    <div>
      <h1>Search</h1>
      <input
        type="text"
        placeholder="Search for items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div>
        <h3>Filters</h3>
        <label>
          Min Price:
          <input
            type="number"
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
        </label>
        <label>
          Max Price:
          <input
            type="number"
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </label>
        <label>
          Item Type:
          <select onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Sports">Sports</option>
          </select>
        </label>
      </div>

      <div>
        <h3>Sort By</h3>
        <select onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div>
        <h2>Search Results</h2>
        {results.map(item => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <p>Condition: {item.condition}</p>
            <p>Type: {item.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;