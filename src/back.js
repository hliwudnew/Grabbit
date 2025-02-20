const express = require('express');
const app = express();
const port = 3000;

// fake data
const mockItems = [
  { id: 1, name: 'Used Laptop', price: 500, condition: 'Good', type: 'Electronics' },
  { id: 2, name: 'Vintage Chair', price: 150, condition: 'Excellent', type: 'Furniture' },
  { id: 3, name: 'Second-hand Bike', price: 200, condition: 'Fair', type: 'Sports' },
  // more listing
];

// searh API
app.get('/api/items', (req, res) => {
  const { query, minPrice, maxPrice, type, sort } = req.query;

  let filteredItems = mockItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  if (minPrice) {
    filteredItems = filteredItems.filter(item => item.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredItems = filteredItems.filter(item => item.price <= parseFloat(maxPrice));
  }
  if (type) {
    filteredItems = filteredItems.filter(item => item.type === type);
  }

  if (sort === 'price_asc') {
    filteredItems.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filteredItems.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    filteredItems.sort((a, b) => b.id - a.id);
  }

  res.json({ status: 'success', data: filteredItems });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});