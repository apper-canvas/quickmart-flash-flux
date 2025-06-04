import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../services';
import MainFeature from '../components/MainFeature';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { ChevronDown, Search, Filter, Grid, List, Star, TrendingUp, Clock, Award, Users, Tag, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [categoryHierarchy, setCategoryHierarchy] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const itemsPerPage = 12;
  
  const { cart, addToCart, updateCartQuantity, removeFromCart, cartItemCount } = useCart();
  
  const cartTotal = cart.reduce((total, item) => {
    const price = item?.discountedPrice || item?.price || 0;
    return total + (price * (item?.quantity || 1));
  }, 0);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load products');
    } finally {
setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const [allCategories, hierarchy] = await Promise.all([
        categoryService.getActiveCategories(),
        categoryService.getCategoryHierarchy()
      ]);
      setCategories(allCategories);
      setCategoryHierarchy(hierarchy);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
};

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleProductClick = (product) => {
    // Handle product click - could navigate to product detail page
    console.log('Product clicked:', product);
  };

  const getFilteredProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      return matchesSearch;
    });

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        if (selectedSubcategory !== 'all') {
          return product.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase();
        }
        return product.category?.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    return filtered;
  };

  const getCurrentPageProducts = () => {
    const filtered = getFilteredProducts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };
const currentProducts = getCurrentPageProducts();
  const totalPages = Math.ceil(getFilteredProducts().length / itemsPerPage);
  const selectedCategoryData = getSelectedCategoryData();

  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 text-red-500 mx-auto mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">ShopHub</h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Cart Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <div className="h-6 w-6">🛒</div>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Filters Sidebar */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setShowFilters(false)}>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-40 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded">
                  ×
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="mr-3 text-primary"
                    />
                    <span className="text-gray-700">All Categories</span>
                  </label>
                  {getMainCategories().map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="mr-3 text-primary"
                      />
                      <span className="text-gray-700 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategory Filter */}
              {selectedCategoryData && selectedCategoryData.subcategories?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    {selectedCategoryData.name} Subcategories
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="subcategory"
                        value="all"
                        checked={selectedSubcategory === 'all'}
                        onChange={(e) => handleSubcategoryChange(e.target.value)}
                        className="mr-3 text-primary"
                      />
                      <span className="text-gray-700">All {selectedCategoryData.name}</span>
                    </label>
                    {selectedCategoryData.subcategories.map((subcategory) => (
                      <label key={subcategory.id} className="flex items-center">
                        <input
                          type="radio"
                          name="subcategory"
                          value={subcategory.id}
                          checked={selectedSubcategory === subcategory.id}
                          onChange={(e) => handleSubcategoryChange(e.target.value)}
                          className="mr-3 text-primary"
                        />
                        <span className="text-gray-700">{subcategory.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Price Range</h3>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all');
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setCurrentPage(1);
  };

  const getSelectedCategoryData = () => {
    return categoryHierarchy.find(cat => cat.id === selectedCategory);
  };

  const handlePriceRangeChange = (field, value) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('featured');
    setCurrentPage(1);
  };

  const getMainCategories = () => {
    return categoryHierarchy.filter(cat => !cat.parentId);
  };
{/* Main Content */}
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MainFeature 
          products={currentProducts}
          loading={loading}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === page
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
{/* Cart Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">Shopping Cart ({cartItemCount})</h3>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 text-gray-300 mx-auto mb-4">🛒</div>
                    <p className="text-gray-500">Your cart is empty</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-4 text-primary hover:text-primary-dark font-medium"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <img
                          src={item?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150'}
                          alt={item?.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item?.name || 'Unknown Product'}</h4>
                          <p className="text-primary font-semibold">₹{item?.discountedPrice || item?.price || 0}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, (item?.quantity || 1) - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="font-medium">{item?.quantity || 1}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, (item?.quantity || 1) + 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-primary">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      toast.success("Proceeding to checkout...");
                      setCartOpen(false);
                    }}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
</div>
  );
};

export default Home;