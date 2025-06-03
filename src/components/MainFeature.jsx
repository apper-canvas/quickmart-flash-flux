import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './ApperIcon'

const MainFeature = ({ products = [], loading = false, onAddToCart }) => {
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Get unique brands from products
  const brands = [...new Set(products?.map(product => product?.brand).filter(Boolean))] || []

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const price = product?.discountedPrice || product?.price || 0
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1]
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product?.brand)
    return matchesPrice && matchesBrand
  }) || []

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a?.discountedPrice || a?.price || 0) - (b?.discountedPrice || b?.price || 0)
      case 'price-high':
        return (b?.discountedPrice || b?.price || 0) - (a?.discountedPrice || a?.price || 0)
      case 'rating':
        return (b?.ratings || 0) - (a?.ratings || 0)
      case 'name':
        return (a?.name || '').localeCompare(b?.name || '')
      default:
        return 0
    }
  })

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const clearFilters = () => {
    setPriceRange([0, 50000])
    setSelectedBrands([])
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(8).fill(0).map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
          <div className="skeleton h-48 rounded-lg mb-4"></div>
          <div className="skeleton h-4 rounded mb-2"></div>
          <div className="skeleton h-4 rounded w-3/4 mb-4"></div>
          <div className="skeleton h-10 rounded"></div>
        </div>
      ))}
    </div>
  )

  const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false)
    
    const discountPercentage = product?.price && product?.discountedPrice 
      ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
      : 0

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden group product-card-hover"
      >
        <div className="relative">
          <img
            src={product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}
            alt={product?.name || 'Product'}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-md text-sm font-semibold">
              {discountPercentage}% OFF
            </div>
          )}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <ApperIcon 
              name="Heart" 
              className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">{product?.brand || 'Unknown Brand'}</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product?.name || 'Product Name'}
          </h3>
          
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <ApperIcon
                key={i}
                name="Star"
                className={`h-4 w-4 ${
                  i < Math.floor(product?.ratings || 0)
                    ? 'text-accent fill-accent'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({product?.ratings || 0})</span>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl font-bold text-primary">₹{(product?.discountedPrice || product?.price || 0).toLocaleString()}</span>
            {product?.discountedPrice && product?.price !== product?.discountedPrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Package" className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">
                {(product?.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {(product?.stock || 0) < 10 && (product?.stock || 0) > 0 && (
              <span className="text-xs text-orange-600 font-medium">Only {product.stock} left!</span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={(product?.stock || 0) === 0}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ApperIcon name="ShoppingCart" className="h-5 w-5" />
            <span>{(product?.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-card">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ApperIcon name="Filter" className="h-5 w-5" />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ApperIcon name="Grid3X3" className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ApperIcon name="List" className="h-5 w-5" />
            </button>
          </div>
          
          <span className="text-sm text-gray-600">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {(showFilters || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-80 bg-white rounded-xl shadow-card p-6 h-fit lg:sticky lg:top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-4">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-4">Brands</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <LoadingSkeleton />
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Package" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : viewMode === 'grid' ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {sortedProducts.map((product) => (
                  <ProductCard key={product?.id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {sortedProducts.map((product) => (
                  <motion.div
                    key={product?.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-300 p-6 flex items-center space-x-6"
                  >
                    <img
                      src={product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                      alt={product?.name || 'Product'}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">{product?.brand || 'Unknown Brand'}</span>
                          <h3 className="font-semibold text-gray-800 mb-1">{product?.name || 'Product Name'}</h3>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <ApperIcon
                                key={i}
                                name="Star"
                                className={`h-4 w-4 ${
                                  i < Math.floor(product?.ratings || 0)
                                    ? 'text-accent fill-accent'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">({product?.ratings || 0})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-primary">₹{(product?.discountedPrice || product?.price || 0).toLocaleString()}</span>
                            {product?.discountedPrice && product?.price !== product?.discountedPrice && (
                              <span className="text-sm text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => onAddToCart(product)}
                          disabled={(product?.stock || 0) === 0}
                          className="bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                        >
                          <ApperIcon name="ShoppingCart" className="h-5 w-5" />
                          <span>{(product?.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainFeature