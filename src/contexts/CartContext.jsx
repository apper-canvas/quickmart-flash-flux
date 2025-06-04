import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('quickmart_cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCart(Array.isArray(parsedCart) ? parsedCart : [])
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      setCart([])
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('quickmart_cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cart])

  const addToCart = (product) => {
    if (!product || !product.id) {
      toast.error('Invalid product')
      return
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        const updatedCart = prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        toast.success(`Updated ${product.name} quantity in cart`)
        return updatedCart
      } else {
        const newCart = [...prevCart, { ...product, quantity: 1 }]
        toast.success(`${product.name} added to cart`)
        return newCart
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== productId)
      toast.success("Item removed from cart")
      return updatedCart
    })
  }

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart => 
      prevCart.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    toast.success("Cart cleared")
  }

  const cartTotal = cart.reduce((total, item) => total + (item?.discountedPrice || item?.price || 0) * (item?.quantity || 0), 0)
  const cartItemCount = cart.reduce((total, item) => total + (item?.quantity || 0), 0)

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartItemCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}