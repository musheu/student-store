import express from 'express'
import bodyParser from 'body-parser'
import Product from './models/product.js'
import Order from './models/order.js'
import OrderItem from './models/orderItem.js'
import cors from 'cors'

const app = express()
app.use(bodyParser.json())
app.use(cors())


// GET /products - Retrieve all products
app.get('/products', async (req, res) => {
  try {
    const { category, sort } = req.query;
    const products = await Product.getAllProducts({ category, sort });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /products/:id - Retrieve a single product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.getProductById(Number(req.params.id))
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /products - Create a new product
app.post('/products', async (req, res) => {
  try {
    const createdProduct = await Product.createProduct(req.body)
    res.status(201).json(createdProduct)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT /products/:id - Update an existing product
app.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.updateProduct(Number(req.params.id), req.body)
    res.json(updatedProduct)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /products/:id - Delete a product
app.delete('/products/:id', async (req, res) => {
  try {
    await Product.deleteProduct(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.getAllOrders()
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /orders/:id
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.getOrderById(Number(req.params.id))
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Define a POST route at the /orders endpoint to handle new order creation
app.post('/orders', async (req, res) => {
  // Log the incoming request body to the console for debugging purposes
  console.log("/orders", req.body);

  try {
    // Call the createOrder method from the Order model with the data from the request body
    // This method saves the order to the database
    const newOrder = await Order.createOrder(req.body)

    // Respond with a 201 Created status and return the newly created order as JSON
    res.status(201).json(newOrder)
  } catch (err) {
    // If there's an error, log the error message to the console
    console.log(err.message);

    // Respond with a 500 Internal Server Error and include the error message in the response
    res.status(500).json({ error: err.message })
  }
})

// Handle PUT request to update an order by its ID
app.put('/orders/:id', async (req, res) => {
  try {
    // Call the updateOrder method from the Order model
    // Pass the order ID (converted to a number) and the request body containing updated fields
    const updated = await Order.updateOrder(Number(req.params.id), req.body)

    // Respond with the updated order as JSON
    res.json(updated)
  } catch (err) {
    // If there's an error (e.g., order not found, DB error), send a 500 status and the error message
    res.status(500).json({ error: err.message })
  }
})

// DELETE /orders/:id
app.delete('/orders/:id', async (req, res) => {
  try {
    await Order.deleteOrder(Number(req.params.id))
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /orders/:orderId/items - Add item to an existing order
app.post('/orders/:orderId/items', async (req, res) => {
  try {
    const { orderId } = req.params;
    const itemData = req.body;
    itemData.orderId = Number(orderId); // attach orderId to data

    const newItem = await OrderItem.createOrderItem(itemData);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /orders/:orderId/total - Calculate total price of order
app.get('/orders/:orderId/total', async (req, res) => {
  try {
    const { orderId } = req.params;
    const total = await Order.calculateTotal(Number(orderId));
    res.json({ totalPrice: total });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }

});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Server running on port 3000'))