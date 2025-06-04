import productData from '../mockData/products.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const productService = {
  async getAll() {
    await delay(300)
    return [...productData]
  },

  async getById(id) {
    await delay(200)
    const product = productData.find(p => p.id === id)
    if (!product) {
      throw new Error('Product not found')
    }
    return { ...product }
  },

  async getByCategory(category) {
    await delay(300)
    return productData.filter(p => p.category === category).map(p => ({ ...p }))
  },

  async create(product) {
    await delay(400)
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    productData.push(newProduct)
    return { ...newProduct }
  },

  async update(id, updates) {
    await delay(300)
    const index = productData.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    productData[index] = { ...productData[index], ...updates }
    return { ...productData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = productData.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    const deleted = productData.splice(index, 1)[0]
    return { ...deleted }
  },

  async search(query) {
    await delay(200)
    const results = productData.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase())
)
    return results.map(p => ({ ...p }))
  },

  async submitRating(productId, ratingData) {
    await delay(400)
    const product = productData.find(p => p.id === productId)
    if (!product) {
      throw new Error('Product not found')
    }

    // Simulate rating submission
    const newRating = {
      id: `r${Date.now()}`,
      userId: ratingData.userId || 'anonymous',
      userName: ratingData.userName || 'Anonymous User',
      rating: ratingData.rating,
      comment: ratingData.comment,
      date: new Date().toISOString().split('T')[0],
      verified: false
    }

    // Add to product reviews
    if (!product.reviews) product.reviews = []
    product.reviews.unshift(newRating)

    // Update rating breakdown
    if (!product.ratingBreakdown) {
      product.ratingBreakdown = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 }
    }
    product.ratingBreakdown[ratingData.rating.toString()]++

    // Update overall rating and review count
    const totalReviews = Object.values(product.ratingBreakdown).reduce((sum, count) => sum + count, 0)
    const weightedSum = Object.entries(product.ratingBreakdown).reduce((sum, [stars, count]) => {
      return sum + (parseInt(stars) * count)
    }, 0)
    
    product.ratings = (weightedSum / totalReviews).toFixed(1)
    product.reviewCount = totalReviews

    return { ...newRating }
  },

  async getRatings(productId) {
    await delay(200)
    const product = productData.find(p => p.id === productId)
    if (!product) {
      throw new Error('Product not found')
    }

    return {
      overall: product.ratings || 0,
      reviewCount: product.reviewCount || 0,
      breakdown: product.ratingBreakdown || {},
      reviews: product.reviews || []
    }
  },

  async updateRating(productId, ratingId, updates) {
    await delay(300)
    const product = productData.find(p => p.id === productId)
    if (!product || !product.reviews) {
      throw new Error('Product or rating not found')
    }

    const ratingIndex = product.reviews.findIndex(r => r.id === ratingId)
    if (ratingIndex === -1) {
      throw new Error('Rating not found')
    }

    product.reviews[ratingIndex] = { ...product.reviews[ratingIndex], ...updates }
product.reviews[ratingIndex] = { ...product.reviews[ratingIndex], ...updates }
    return { ...product.reviews[ratingIndex] }
  },

  // Cart-related product operations
  async validateCartItem(productId, options = {}) {
    await delay(150)
    const product = productData.find(p => p.id === productId)
    if (!product) {
      throw new Error('Product not found')
    }

    // Check stock availability
    if (product.stock <= 0) {
      throw new Error('Product is out of stock')
    }

    // Validate size selection for applicable products
    if (product.hasSizes && !options.size) {
      throw new Error('Please select a size')
    }

    // Validate color selection for applicable products
    if (product.hasColors && !options.color) {
      throw new Error('Please select a color')
    }

    return {
      valid: true,
      product: { ...product },
      availableStock: product.stock
    }
  },

  async updateStock(productId, quantity) {
    await delay(200)
    const product = productData.find(p => p.id === productId)
    if (!product) {
      throw new Error('Product not found')
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock')
    }

    product.stock -= quantity
    return { ...product }
  },

  async checkStockAvailability(productId, requestedQuantity) {
    await delay(100)
    const product = productData.find(p => p.id === productId)
    if (!product) {
      throw new Error('Product not found')
    }

    return {
      available: product.stock >= requestedQuantity,
      currentStock: product.stock,
      maxQuantity: Math.min(product.stock, 10) // Limit max quantity to 10
    }
  }
}

export default productService