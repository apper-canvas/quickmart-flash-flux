import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import productService from '../services/api/productService'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [showOffers, setShowOffers] = useState(false)
  const [cart, setCart] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [offers] = useState([
    {
      type: 'bank',
      title: 'Bank Offer',
      description: '10% Instant Discount with HDFC Bank Credit Cards',
      code: 'HDFC10',
      savings: '₹200',
      icon: 'CreditCard',
      color: 'blue'
    },
    {
      type: 'cashback',
      title: 'Cashback Offer',
      description: 'Get 5% cashback up to ₹150 on first order',
      code: 'FIRST5',
      savings: '₹150',
      icon: 'Gift',
      color: 'green'
    },
    {
      type: 'coupon',
      title: 'Coupon Code',
      description: 'Extra ₹100 off on orders above ₹999',
      code: 'SAVE100',
      savings: '₹100',
      icon: 'Tag',
      color: 'purple'
    },
    {
      type: 'exchange',
      title: 'Exchange Offer',
      description: 'Up to ₹5000 off on exchange of old products',
      code: 'EXCHANGE',
      savings: '₹5000',
      icon: 'RefreshCw',
      color: 'orange'
    }
  ])

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      try {
        const productData = await productService.getById(id)
        setProduct(productData)
        
        // Load related products from same category
        const related = await productService.getByCategory(productData.category)
        setRelatedProducts(related.filter(p => p.id !== id).slice(0, 4))
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      loadProduct()
    }
  }, [id])

  const addToCart = () => {
    if (!product) return
    
    const cartItem = { ...product, quantity }
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        const updatedCart = prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        toast.success(`Updated ${product.name} quantity in cart`)
        return updatedCart
      } else {
        toast.success(`${product.name} added to cart`)
        return [...prev, cartItem]
      }
    })
  }

  const buyNow = () => {
    addToCart()
    toast.success("Proceeding to checkout...")
    // Navigate to checkout page (would be implemented)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-primary hover:text-primary-dark"
              >
                <ApperIcon name="ArrowLeft" className="h-5 w-5 mr-2" />
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
          </div>
        </header>
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-primary hover:text-primary-dark"
              >
                <ApperIcon name="ArrowLeft" className="h-5 w-5 mr-2" />
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
          </div>
        </header>
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <ApperIcon name="AlertCircle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-primary hover:text-primary-dark transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Home</span>
            </button>
            
            <div className="flex items-center">
              <ApperIcon name="ShoppingBag" className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-bold text-gray-800">QuickMart</span>
            </div>
          </div>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div 
              className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <ApperIcon
                    key={i}
                    name="Star"
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">₹{product.discountedPrice || product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-green-600 text-sm font-medium">Inclusive of all taxes</p>
</div>

            {/* Available Offers */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowOffers(!showOffers)}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Zap" className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-800">Available Offers</h3>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {offers.length} Offers
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: showOffers ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ApperIcon name="ChevronDown" className="h-5 w-5 text-gray-600" />
                </motion.div>
              </div>

              <AnimatePresence>
                {showOffers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-3"
                  >
                    {offers.map((offer, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full bg-${offer.color}-100`}>
                            <ApperIcon name={offer.icon} className={`h-4 w-4 text-${offer.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-800">{offer.title}</h4>
                              <span className="text-sm font-semibold text-green-600">{offer.savings}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border-dashed border">
                                {offer.code}
                              </span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(offer.code)
                                  toast.success(`Code ${offer.code} copied to clipboard!`)
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Copy Code
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <div className="text-center pt-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View All Offers & Terms
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <ApperIcon name="Minus" className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <ApperIcon name="Plus" className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={buyNow}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ApperIcon name="Zap" className="h-5 w-5" />
                <span>Buy Now</span>
              </button>
              <button
                onClick={addToCart}
                className="w-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ApperIcon name="ShoppingCart" className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Truck" className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="RefreshCw" className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Easy Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Shield" className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="CreditCard" className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex border-b mb-6">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  {product.features && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Key Features:</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <ApperIcon name="Check" className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-700 capitalize">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2">
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium text-gray-700">Brand:</span>
                          <span className="text-gray-600">{product.brand}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium text-gray-700">Category:</span>
                          <span className="text-gray-600 capitalize">{product.category}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium text-gray-700">SKU:</span>
                          <span className="text-gray-600">{product.id}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <ApperIcon
                            key={i}
                            name="Star"
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} out of 5 ({product.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                  
                  {product.reviews ? (
                    <div className="space-y-4">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <ApperIcon
                                  key={i}
                                  name="Star"
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium text-gray-800">{review.author}</span>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ApperIcon name="MessageCircle" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <img
                    src={relatedProduct.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                    alt={relatedProduct.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{relatedProduct.name}</h4>
                  <p className="text-primary font-semibold">₹{relatedProduct.discountedPrice || relatedProduct.price}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ProductDetail