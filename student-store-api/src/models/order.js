const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Order {
  // Create a new order
  static async createOrder(data) {
    return await prisma.order.create({
      data: {
        customer: data.customer,
        totalPrice: data.totalPrice,
        status: data.status,
        createdAt: new Date(),
        orderItems: {
          create: data.orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { orderItems: true }
    });
  }

  // Get all orders
  static async getAllOrders() {
    return await prisma.order.findMany({
      include: { orderItems: true }
    });
  }

  // Get order by ID
  static async getOrderById(orderId) {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }
    });
  }

  // Update an order
  static async updateOrder(orderId, updateData) {
    return await prisma.order.update({
      where: { id: orderId },
      data: {
        status: updateData.status,
        totalPrice: updateData.totalPrice
      },
      include: { orderItems: true }
    });
  }

  // Delete an order
  static async deleteOrder(orderId) {
    return await prisma.order.delete({
      where: { id: orderId }
    });
  }

  static async calculateTotal(orderId) {
  const items = await prisma.orderItem.findMany({
    where: { orderId }
  });

  return items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}
}

module.exports = Order;