import { useState, useMemo } from 'react';
import './App.css';

const products = [
  { id: 1, name: 'Wireless Headphones', price: 129.99, category: 'electronics' },
  { id: 2, name: 'Cotton T-Shirt', price: 24.99, category: 'clothing' },
  { id: 3, name: 'Bluetooth Speaker', price: 89.99, category: 'electronics' },
  { id: 4, name: 'Denim Jeans', price: 59.99, category: 'clothing' },
  { id: 5, name: 'Smart Watch', price: 199.99, category: 'electronics' },
  { id: 6, name: 'Running Shoes', price: 79.99, category: 'clothing' },
  { id: 7, name: 'Laptop Stand', price: 45.99, category: 'electronics' },
  { id: 8, name: 'Winter Jacket', price: 149.99, category: 'clothing' },
];

function App() {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');

  const filteredAndSortedProducts = useMemo(() => {
    // Filter
    let result = filter === 'all'
      ? [...products]
      : products.filter(p => p.category === filter);

    // Sort
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [filter, sort]);

  return (
    <div className="container">
      <h1>Product Filter</h1>

      <div className="controls">
        <div className="control-group">
          <label>Filter by:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Products</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sort by:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {filteredAndSortedProducts.map((product, index) => (
          <div
            key={product.id}
            className="product-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <h2>{product.name}</h2>
            <p className="price">${product.price.toFixed(2)}</p>
            <span className={`tag ${product.category}`}>{product.category}</span>
          </div>
        ))}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <p className="no-results">No products found.</p>
      )}
    </div>
  );
}

export default App;
