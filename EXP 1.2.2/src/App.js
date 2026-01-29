import React, { useState } from 'react';
import './App.css';

function App() {
  const [filter, setFilter] = useState('all');

  const products = [
    { id: 1, name: 'Laptop', category: 'electronics', price: 999, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
    { id: 2, name: 'Smartphone', category: 'electronics', price: 699, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
    { id: 3, name: 'Headphones', category: 'electronics', price: 199, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { id: 4, name: 'T-Shirt', category: 'clothing', price: 29, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { id: 5, name: 'Jeans', category: 'clothing', price: 59, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    { id: 6, name: 'Sneakers', category: 'clothing', price: 89, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400' },
    { id: 7, name: 'Coffee Maker', category: 'home', price: 79, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400' },
    { id: 8, name: 'Desk Lamp', category: 'home', price: 45, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
    { id: 9, name: 'Wall Clock', category: 'home', price: 35, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400' },
    { id: 10, name: 'Camera', category: 'electronics', price: 1299, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400' },
    { id: 11, name: 'Watch', category: 'accessories', price: 249, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    { id: 12, name: 'Backpack', category: 'accessories', price: 69, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' }
  ];

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.category === filter);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Product Store</h1>
        <div className="filter-container">
          <label htmlFor="category-filter">Filter by Category: </label>
          <select 
            id="category-filter" 
            value={filter} 
            onChange={handleFilterChange}
            className="filter-dropdown"
          >
            <option value="all">All Products</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </header>

      <main className="products-container">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="price">${product.price}</p>
              <button className="add-to-cart">Add to Cart</button>
            </div>
          </div>
        ))}
      </main>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No products found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default App;
