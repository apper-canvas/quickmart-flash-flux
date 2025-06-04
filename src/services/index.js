export { default as productService } from './api/productService.js'
export { default as userService } from './api/userService.js'
export { default as orderService } from './api/orderService.js'

// Cart utilities
export const cartUtils = {
  getStoredCart: () => {
    try {
      const cart = localStorage.getItem('quickmart_cart')
      return cart ? JSON.parse(cart) : []
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      return []
    }
  },
  
  saveCart: (cart) => {
    try {
      localStorage.setItem('quickmart_cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  },
  
  clearCart: () => {
    try {
      localStorage.removeItem('quickmart_cart')
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error)
    }
  },
  
  calculateTotal: (cart) => {
    return cart.reduce((total, item) => {
      const price = item?.discountedPrice || item?.price || 0
      const quantity = item?.quantity || 0
      return total + (price * quantity)
    }, 0)
  },
  
  getItemCount: (cart) => {
    return cart.reduce((total, item) => total + (item?.quantity || 0), 0)
  },
  
  validateCartItem: (item) => {
    return item && 
           item.id && 
           item.name && 
           (item.price || item.discountedPrice) && 
           item.quantity > 0
  }
}