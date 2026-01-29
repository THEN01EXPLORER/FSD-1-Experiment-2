import { useState, useMemo } from 'react';
import './App.css';

const products = [
  { id: 1, name: 'Wireless Headphones', price: 129.99, category: 'electronics' },
  { id: 2, name: 'Cotton T-Shirt', price: 24.99, category: 'clothing' },
  { id: 3, name: 'Bluetooth Speaker', price: 89.99, category: 'electronics' },
  { id: 4, name: 'Denim Jeans', price: 59.99, category: 'clothing' },
  { id: 5, name: 'Smart Watch', price: 199.99, category: 'electronics' },
  { id: 6, name: 'Running Shoes', price: 79.99, category: 'clothing' },
];

function App() {
  const [filter, setFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter(p => p.category === filter);
  }, [filter]);

  return (
    <div className="container">
      <h1>Product Filter</h1>

      <div className="filter-bar">
        <label htmlFor="filter">Filter by:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <p className="price">${product.price.toFixed(2)}</p>
            <span className={`tag ${product.category}`}>{product.category}</span>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="no-results">No products found.</p>
      )}
    </div>
  );
}

export default App;
