import { useState, useMemo } from 'react';
import './App.css';

const PRODUCTS = [
  { id: 1, name: 'Premium Wireless Headphones', category: 'Electronics', price: 299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { id: 2, name: 'Ergonomic Office Chair', category: 'Furniture', price: 199, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80' },
  { id: 3, name: 'Smart Fitness Watch', category: 'Electronics', price: 149, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  { id: 4, name: 'Organic Green Tea', category: 'Groceries', price: 25, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&q=80' },
  { id: 5, name: 'Minimalist Desk Lamp', category: 'Furniture', price: 89, image: 'https://images.unsplash.com/photo-1507473888900-52e1ad146957?w=500&q=80' },
  { id: 6, name: 'Professional Camera Kit', category: 'Electronics', price: 1299, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80' },
  { id: 7, name: 'Running Shoes', category: 'Fashion', price: 119, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 8, name: 'Ceramic Coffee Mug', category: 'Kitchen', price: 15, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' },
  { id: 9, name: 'Leather Wallet', category: 'Fashion', price: 45, image: 'https://images.unsplash.com/photo-1627123424574-18bd03606705?w=500&q=80' },
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');

  const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sort
    if (sortOption === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, sortOption]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Dynamic Product Store</h1>
        <p>Experiment 1.2.2: Filter, Sort, and Respond</p>
      </header>

      <div className="controls">
        <div className="control-group">
          <label>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="control-group">
          <label>Sort By:</label>
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {filteredAndSortedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="image-container">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="card-content">
              <span className="category-tag">{product.category}</span>
              <h3>{product.name}</h3>
              <div className="price">${product.price}</div>
              <button className="add-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAndSortedProducts.length === 0 && (
        <div className="no-results">No products found.</div>
      )}
    </div>
  );
}

export default App;
