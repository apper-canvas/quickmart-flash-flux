import categoryData from '../mockData/categories.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const categoryService = {
  async getAll() {
    await delay(300)
    return [...categoryData]
  },

  async getById(id) {
    await delay(200)
    const category = categoryData.find(c => c.id === id)
    if (!category) {
      throw new Error('Category not found')
    }
    return { ...category }
  },

  async getSubcategories(parentId) {
    await delay(250)
    return categoryData
      .filter(c => c.parentId === parentId)
      .map(c => ({ ...c }))
  },

  async getCategoryHierarchy() {
    await delay(350)
    const parentCategories = categoryData.filter(c => !c.parentId)
    const hierarchy = parentCategories.map(parent => ({
      ...parent,
      subcategories: categoryData
        .filter(c => c.parentId === parent.id)
        .map(sub => ({ ...sub }))
    }))
    return hierarchy
  },

  async create(category) {
    await delay(400)
    const newCategory = {
      ...category,
      id: `cat_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    categoryData.push(newCategory)
    return { ...newCategory }
  },

  async update(id, updates) {
    await delay(350)
    const index = categoryData.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    categoryData[index] = { 
      ...categoryData[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    }
    return { ...categoryData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = categoryData.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    // Check if category has subcategories
    const hasSubcategories = categoryData.some(c => c.parentId === id)
    if (hasSubcategories) {
      throw new Error('Cannot delete category with subcategories')
    }
    
    const deleted = categoryData.splice(index, 1)[0]
    return { ...deleted }
  },

  async search(query) {
    await delay(200)
    const results = categoryData.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
    )
    return results.map(c => ({ ...c }))
  },

  async getActiveCategories() {
    await delay(250)
    return categoryData
      .filter(c => c.isActive !== false)
      .map(c => ({ ...c }))
  },

  async toggleStatus(id) {
    await delay(250)
    const index = categoryData.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    categoryData[index].isActive = !categoryData[index].isActive
    categoryData[index].updatedAt = new Date().toISOString()
    return { ...categoryData[index] }
  },

  async reorderCategories(categoryIds) {
    await delay(300)
    categoryIds.forEach((id, index) => {
      const categoryIndex = categoryData.findIndex(c => c.id === id)
      if (categoryIndex !== -1) {
        categoryData[categoryIndex].sortOrder = index
        categoryData[categoryIndex].updatedAt = new Date().toISOString()
      }
    })
    return categoryData.map(c => ({ ...c }))
  }
}

export default categoryService