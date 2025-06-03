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
  }
}

export default productService