import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import productService from '../services/api/productService'
const Home = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([])
const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Cart utility functions and computed values
  const cartItemCount = cart.reduce((total, item) => total + (item?.quantity || 1), 0)
  
  const cartTotal = cart.reduce((total, item) => {
    const price = item?.discountedPrice || item?.price || 0
    const quantity = item?.quantity || 1
    return total + (price * quantity)
  }, 0)

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + 1)
    } else {
      setCart(prev => [...prev, { ...product, quantity: 1 }])
      toast.success("Product added to cart!")
    }
  }

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
    toast.success("Product removed from cart")
  }

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const result = await productService.getAll()
        setProducts(result)
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load products")
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
}, [])

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

const categories = ["all", "electronics", "clothing", "home", "books", "sports"]
  
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesCategory = selectedCategory === "all" || product?.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <ApperIcon name="ShoppingBag" className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">QuickMart</h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <ApperIcon name="ShoppingCart" className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-5xl font-bold mb-4"
          >
            Discover Amazing Deals
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl opacity-90 mb-8"
          >
            Shop from millions of products with best prices and fast delivery
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm font-medium">✨ Free Shipping on orders above ₹499</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm font-medium">🔥 Up to 70% OFF</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 lg:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MainFeature 
          products={filteredProducts}
          loading={loading}
loading={loading}
          onProductClick={handleProductClick}
        />
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
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ApperIcon name="ShoppingCart" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
                              <ApperIcon name="Minus" className="h-4 w-4" />
                            </button>
                            <span className="font-medium">{item?.quantity || 1}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, (item?.quantity || 1) + 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <ApperIcon name="Plus" className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
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
                      toast.success("Proceeding to checkout...")
                      setCartOpen(false)
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
  )
}

export default Home