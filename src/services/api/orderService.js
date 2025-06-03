import orderData from '../mockData/orders.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const orderService = {
  async getAll() {
    await delay(300)
    return [...orderData]
  },

  async getById(id) {
    await delay(200)
    const order = orderData.find(o => o.id === id)
    if (!order) {
      throw new Error('Order not found')
    }
    return { ...order }
  },

  async getByUserId(userId) {
    await delay(250)
    return orderData.filter(o => o.userId === userId).map(o => ({ ...o }))
  },

  async create(order) {
    await delay(500)
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      status: 'confirmed',
      trackingId: `QM${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
    orderData.push(newOrder)
    return { ...newOrder }
  },

  async update(id, updates) {
    await delay(300)
    const index = orderData.findIndex(o => o.id === id)
    if (index === -1) {
      throw new Error('Order not found')
    }
    orderData[index] = { ...orderData[index], ...updates }
    return { ...orderData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = orderData.findIndex(o => o.id === id)
    if (index === -1) {
      throw new Error('Order not found')
    }
    const deleted = orderData.splice(index, 1)[0]
    return { ...deleted }
  },

  async updateStatus(id, status) {
    await delay(200)
    const index = orderData.findIndex(o => o.id === id)
    if (index === -1) {
      throw new Error('Order not found')
    }
    orderData[index].status = status
    orderData[index].updatedAt = new Date().toISOString()
    return { ...orderData[index] }
  }
}

export default orderService