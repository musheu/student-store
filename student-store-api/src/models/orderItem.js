const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderItem {
  // Create a new order item
  static async createOrderItem(data) {
    return await prisma.orderItem.create({
      data: {
        orderId: data.orderId,
        productId: data.productId,
        quantity: data.quantity,
        price: data.price
      }
    });
  }

  // Get all order items for a specific order
  static async getOrderItemsByOrderId(orderId) {
    return await prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true } // optional: include product details
    });
  }
}

module.exports = OrderItem;
