const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Product {
  // Create a new product
  static async createProduct(data) {
    return await prisma.product.create({
      data,
    });
  }

  // Get all products with optional filtering and sorting
  static async getAllProducts({ category, sort }) {
    const where = {};
    const orderBy = [];

    // Filter by category if provided
    if (category) {
      where.category = category;
    }

    // Sort by name or price if provided
    if (sort === 'name' || sort === 'price') {
      orderBy.push({ [sort]: 'asc' }); // Default to ascending
    }

    return await prisma.product.findMany({
      where,
      orderBy,
    });
  }

  // Get a single product by ID
  static async getProductById(productId) {
    return await prisma.product.findUnique({
      where: { id: productId },
    });
  }

  // Update a product by ID
  static async updateProduct(productId, updateData) {
    return await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });
  }

  // Delete a product by ID
  static async deleteProduct(productId) {
    return await prisma.product.delete({
      where: { id: productId },
    });
  }
}

module.exports = Product;