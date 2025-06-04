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
  const [deliveryCode, setDeliveryCode] = useState('')
  const [deliveryInfo, setDeliveryInfo] = useState(null)
  const [checkingDelivery, setCheckingDelivery] = useState(false)
const [cart, setCart] = useState([])
const [relatedProducts, setRelatedProducts] = useState([])
const [showWarranty, setShowWarranty] = useState(false)
  const [warrantyRegistered, setWarrantyRegistered] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userName, setUserName] = useState('')
  const [userComment, setUserComment] = useState('')
  const [submittingRating, setSubmittingRating] = useState(false)
  const [ratingStats, setRatingStats] = useState(null)
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
const [warrantyInfo] = useState({
    duration: '2 Years',
    type: 'Comprehensive Warranty',
    coverage: [
      'Manufacturing defects',
      'Electrical component failure',
      'Free repair and replacement',
      'On-site service available'
    ],
    exclusions: [
      'Physical damage due to misuse',
      'Water damage',
      'Accidental damage'
    ],
    registrationRequired: true,
claimProcess: '1800-XXX-XXXX or visit service center'
  })

  const [sizeChart] = useState({
    available: ['clothing', 'sports', 'shoes'].includes(product?.category),
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    measurements: {
      'XS': { chest: '32-34', waist: '26-28', hip: '34-36', length: '26' },
      'S': { chest: '34-36', waist: '28-30', hip: '36-38', length: '27' },
      'M': { chest: '36-38', waist: '30-32', hip: '38-40', length: '28' },
      'L': { chest: '38-40', waist: '32-34', hip: '40-42', length: '29' },
      'XL': { chest: '40-42', waist: '34-36', hip: '42-44', length: '30' },
      'XXL': { chest: '42-44', waist: '36-38', hip: '44-46', length: '31' }
    },
    conversions: {
      'XS': { us: 'XS', eu: '32', uk: '4' },
      'S': { us: 'S', eu: '34', uk: '6' },
      'M': { us: 'M', eu: '36', uk: '8' },
      'L': { us: 'L', eu: '38', uk: '10' },
      'XL': { us: 'XL', eu: '40', uk: '12' },
      'XXL': { us: 'XXL', eu: '42', uk: '14' }
    },
    fitGuide: [
      'Chest: Measure around the fullest part of your chest',
      'Waist: Measure around the narrowest part of your waist',
      'Hip: Measure around the fullest part of your hips',
      'Length: Measured from shoulder to hem'
    ]
  })

  const handleSizeSelection = (size) => {
    setSelectedSize(size)
    toast.success(`Size ${size} selected`)
  }
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

  // Load rating statistics
  useEffect(() => {
    const loadRatingStats = async () => {
      if (!id) return
      
      try {
        const stats = await productService.getRatings(id)
        setRatingStats(stats)
      } catch (err) {
        console.error('Failed to load rating stats:', err)
      }
    }
    
    loadRatingStats()
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

  const handleDeliveryCheck = async () => {
    if (!deliveryCode.trim()) {
      toast.error("Please enter a valid delivery code")
      return
    }

    if (deliveryCode.length < 5) {
      toast.error("Please enter a valid postal code")
      return
    }

    setCheckingDelivery(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock delivery logic based on postal code
      const firstDigit = deliveryCode.charAt(0)
      let deliveryOptions = []
      
      if (['1', '2', '3'].includes(firstDigit)) {
        // Metro cities - faster delivery
        deliveryOptions = [
          {
            type: 'Same Day',
            date: 'Today, by 10 PM',
            charge: '₹99',
            available: true
          },
          {
            type: 'Next Day',
            date: 'Tomorrow, by 6 PM',
            charge: 'FREE',
            available: true
          }
        ]
      } else if (['4', '5', '6'].includes(firstDigit)) {
        // Tier 2 cities
        deliveryOptions = [
          {
            type: 'Express',
            date: 'Tomorrow, by 8 PM',
            charge: '₹49',
            available: true
          },
          {
            type: 'Standard',
            date: '2-3 business days',
            charge: 'FREE',
            available: true
          }
        ]
      } else if (['7', '8', '9'].includes(firstDigit)) {
        // Tier 3 cities and rural areas
        deliveryOptions = [
          {
            type: 'Standard',
            date: '3-5 business days',
            charge: 'FREE',
            available: true
          },
          {
            type: 'Express',
            date: '2-3 business days',
            charge: '₹79',
            available: true
          }
        ]
      } else {
        // Invalid or non-serviceable area
        setDeliveryInfo({ serviceable: false })
        toast.error("Sorry, we don't deliver to this area yet")
        setCheckingDelivery(false)
        return
      }

      setDeliveryInfo({
        serviceable: true,
        pincode: deliveryCode,
        options: deliveryOptions
      })
      
      toast.success("Delivery options found!")
      
    } catch (error) {
      toast.error("Failed to check delivery. Please try again.")
      setDeliveryInfo(null)
    } finally {
      setCheckingDelivery(false)
    }
}
  
  const handleWarrantyRegistration = () => {
    if (warrantyRegistered) {
      toast.info("Product warranty is already registered")
return
}
    
    setWarrantyRegistered(true)
    toast.success("Warranty registered successfully! Registration details sent to your email.")
  }

  const handleRatingSubmit = async () => {
    // Validation
    if (userRating === 0) {
      toast.error("Please select a rating")
      return
    }
    
    if (!userName.trim()) {
      toast.error("Please enter your name")
      return
    }
    
    if (!userComment.trim()) {
      toast.error("Please write a review")
      return
    }

    setSubmittingRating(true)
    
    try {
      const ratingData = {
        rating: userRating,
        userName: userName.trim(),
        comment: userComment.trim(),
        userId: 'user123' // In a real app, this would come from auth
      }

      await productService.submitRating(id, ratingData)
      
      // Reload rating stats
      const updatedStats = await productService.getRatings(id)
      setRatingStats(updatedStats)
      
      // Reset form
      setShowRatingForm(false)
      setUserRating(0)
      setUserName('')
      setUserComment('')
      
      toast.success("Thank you for your review! It has been submitted successfully.")
      
    } catch (error) {
      console.error('Rating submission failed:', error)
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setSubmittingRating(false)
    }
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

            {/* Delivery Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <ApperIcon name="Truck" className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Delivery Information</h3>
              </div>
              
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={deliveryCode}
                  onChange={(e) => setDeliveryCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter PIN Code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleDeliveryCheck}
                  disabled={checkingDelivery || !deliveryCode.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center space-x-2"
                >
                  {checkingDelivery ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Search" className="h-4 w-4" />
                      <span>Check</span>
                    </>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {deliveryInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {deliveryInfo.serviceable ? (
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <ApperIcon name="CheckCircle" className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            Delivery available to {deliveryInfo.pincode}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {deliveryInfo.options.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                            >
                              <div>
                                <span className="font-medium text-gray-800">{option.type} Delivery</span>
                                <p className="text-sm text-gray-600">{option.date}</p>
                              </div>
                              <div className="text-right">
                                <span className={`font-semibold ${
                                  option.charge === 'FREE' ? 'text-green-600' : 'text-gray-800'
                                }`}>
                                  {option.charge}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-500">
                          * Delivery charges may vary based on product weight and dimensions
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="XCircle" className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-700">
                            Sorry, delivery not available to this area
                          </span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">
                          Please check with a different PIN code or contact support
</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Warranty Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowWarranty(!showWarranty)}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Shield" className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Warranty Information</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                    {warrantyInfo.duration}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: showWarranty ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ApperIcon name="ChevronDown" className="h-5 w-5 text-gray-600" />
                </motion.div>
              </div>

              <AnimatePresence>
                {showWarranty && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-4"
                  >
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Warranty Coverage</h4>
                          <ul className="space-y-1">
                            {warrantyInfo.coverage.map((item, index) => (
                              <li key={index} className="flex items-center space-x-2 text-sm">
                                <ApperIcon name="CheckCircle" className="h-4 w-4 text-green-600" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Not Covered</h4>
                          <ul className="space-y-1">
                            {warrantyInfo.exclusions.map((item, index) => (
                              <li key={index} className="flex items-center space-x-2 text-sm">
                                <ApperIcon name="XCircle" className="h-4 w-4 text-red-600" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-800">Warranty Registration</h4>
                            <p className="text-sm text-gray-600">
                              {warrantyRegistered ? 'Your product warranty is registered' : 'Register your product to activate warranty'}
                            </p>
                          </div>
                          <button
                            onClick={handleWarrantyRegistration}
                            disabled={warrantyRegistered}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                              warrantyRegistered
                                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                          >
                            {warrantyRegistered ? (
                              <>
                                <ApperIcon name="CheckCircle" className="h-4 w-4" />
                                <span>Registered</span>
                              </>
                            ) : (
                              <>
                                <ApperIcon name="Shield" className="h-4 w-4" />
                                <span>Register Now</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <ApperIcon name="Phone" className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">Warranty Claims</p>
                              <p className="text-sm text-gray-600">{warrantyInfo.claimProcess}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
</div>

            {/* Size Chart */}
            {sizeChart.available && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowSizeChart(!showSizeChart)}
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Ruler" className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-800">Size Chart</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                      Sizing Guide
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: showSizeChart ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ApperIcon name="ChevronDown" className="h-5 w-5 text-gray-600" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {showSizeChart && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-4"
                    >
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        {/* Size Selection */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-3">Select Your Size</h4>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {sizeChart.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeSelection(size)}
                                className={`p-3 border-2 rounded-lg font-medium transition-all ${
                                  selectedSize === size
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                          {selectedSize && (
                            <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                              <p className="text-sm text-indigo-700">
                                <strong>Selected:</strong> Size {selectedSize} - 
                                Chest: {sizeChart.measurements[selectedSize]?.chest}", 
                                Waist: {sizeChart.measurements[selectedSize]?.waist}"
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Measurements Table */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-3">Size Measurements (inches)</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 rounded-lg">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">Size</th>
                                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">Chest</th>
                                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">Waist</th>
                                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">Hip</th>
                                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">Length</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sizeChart.sizes.map((size, index) => (
                                  <tr 
                                    key={size} 
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                                      selectedSize === size ? 'bg-indigo-50 border-indigo-200' : ''
                                    }`}
                                  >
                                    <td className="px-3 py-2 text-sm font-medium text-gray-800 border-b">{size}</td>
                                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{sizeChart.measurements[size]?.chest}</td>
                                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{sizeChart.measurements[size]?.waist}</td>
                                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{sizeChart.measurements[size]?.hip}</td>
                                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{sizeChart.measurements[size]?.length}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Size Conversion */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-3">International Size Conversion</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 rounded-lg">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">Size</th>
                                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">US</th>
                                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">EU</th>
                                  <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b">UK</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sizeChart.sizes.map((size, index) => (
                                  <tr 
                                    key={size} 
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                                      selectedSize === size ? 'bg-indigo-50 border-indigo-200' : ''
                                    }`}
                                  >
                                    <td className="px-3 py-2 text-sm font-medium text-gray-800 border-b">{size}</td>
                                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{sizeChart.conversions[size]?.us}</td>
                                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{sizeChart.conversions[size]?.eu}</td>
                                    <td className="px-3 py-2 text-sm text-gray-600 border-b">{sizeChart.conversions[size]?.uk}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Fit Guide */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-3">How to Measure</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {sizeChart.fitGuide.map((guide, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <ApperIcon name="Info" className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{guide}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Size Recommendations */}
                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                          <div className="flex items-start space-x-2">
                            <ApperIcon name="Lightbulb" className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">Size Recommendation</p>
                              <p className="text-sm text-yellow-700 mt-1">
                                For a comfortable fit, we recommend sizing up if you're between sizes. 
                                All measurements are approximate and may vary slightly.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Contact for Size Help */}
                        <div className="text-center pt-3 border-t">
                          <p className="text-sm text-gray-600 mb-2">Need help with sizing?</p>
                          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                            Contact Size Expert
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
{/* Quantity and Size Selector */}
            <div className="space-y-4">
              {/* Size Selection Summary */}
              {sizeChart.available && selectedSize && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="CheckCircle" className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Selected Size: <strong>{selectedSize}</strong>
                    </span>
                  </div>
                </div>
              )}

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
                  {/* Rating Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Overall Rating */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-800 mb-2">
                          {ratingStats?.overall || product.ratings || 0}
                        </div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <ApperIcon
                              key={i}
                              name="Star"
                              className={`h-5 w-5 ${
                                i < Math.floor(ratingStats?.overall || product.ratings || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          Based on {ratingStats?.reviewCount || product.reviewCount || 0} reviews
                        </p>
                      </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold mb-4">Rating Breakdown</h4>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const breakdown = ratingStats?.breakdown || product.ratingBreakdown || {}
                          const count = breakdown[stars.toString()] || 0
                          const total = Object.values(breakdown).reduce((sum, c) => sum + c, 0)
                          const percentage = total > 0 ? (count / total) * 100 : 0

                          return (
                            <div key={stars} className="flex items-center space-x-3">
                              <span className="text-sm w-8">{stars}★</span>
                              <div className="flex-1 rating-breakdown-bar">
                                <div 
                                  className="rating-breakdown-fill"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-12">
                                {count}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Add Review Button */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <button
                      onClick={() => setShowRatingForm(!showRatingForm)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
                    >
                      <ApperIcon name="Plus" className="h-4 w-4" />
                      <span>Write Review</span>
                    </button>
                  </div>

                  {/* Rating Form */}
                  <AnimatePresence>
                    {showRatingForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rating-form"
                      >
                        <h4 className="font-semibold mb-4">Share Your Experience</h4>
                        
                        <div className="space-y-4">
                          {/* Star Rating */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Rating *
                            </label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setUserRating(star)}
                                  className="rating-star"
                                >
                                  <ApperIcon
                                    name="Star"
                                    className={`h-8 w-8 ${
                                      star <= userRating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300 hover:text-yellow-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Name Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Name *
                            </label>
                            <input
                              type="text"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              placeholder="Enter your name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>

                          {/* Comment Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Review *
                            </label>
                            <textarea
                              value={userComment}
                              onChange={(e) => setUserComment(e.target.value)}
                              placeholder="Share your experience with this product..."
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            />
                          </div>

                          {/* Submit Buttons */}
                          <div className="flex space-x-3">
                            <button
                              onClick={handleRatingSubmit}
                              disabled={submittingRating}
                              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                            >
                              {submittingRating ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Submitting...</span>
                                </>
                              ) : (
                                <>
                                  <ApperIcon name="Send" className="h-4 w-4" />
                                  <span>Submit Review</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setShowRatingForm(false)
                                setUserRating(0)
                                setUserComment('')
                                setUserName('')
                              }}
                              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Reviews List */}
                  {(ratingStats?.reviews || product.reviews) ? (
                    <div className="space-y-4">
                      {(ratingStats?.reviews || product.reviews).map((review, index) => (
                        <motion.div
                          key={review.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-lg p-4 rating-hover-effect transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                                {(review.userName || review.author || 'A').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800">
                                  {review.userName || review.author}
                                </h5>
                                <div className="flex items-center space-x-2">
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
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                  {review.verified && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                      Verified Purchase
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ApperIcon name="MessageCircle" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h3>
                      <p className="text-gray-500 mb-4">Be the first to review this product!</p>
                      <button
                        onClick={() => setShowRatingForm(true)}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Write First Review
                      </button>
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