import mongoose from 'mongoose';

// Create order Model

// Create a order Schema using new mongoose.Schema

const orderSchema = new mongoose.Schema(
  // accept an object as a parameter
  {
    // list the fields of orderSchema
    user: {
      type: mongoose.Schema.Types.ObjectId, // type ObjectId
      ref: 'User', // reference to the UserModel
      required: true, // it's required
    },
    // orderItems is an array
    orderItems: [
      // each item in a orderItems is an object
      {
        name: { type: String, required: true }, // name of product
        quantity: { type: Number, required: true }, // quantity of product
        image: { type: String, required: true }, // image of product
        price: { type: Number, required: true }, // price of product
      },
    ],
    // define shippingAddress object
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    // status
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    /* when we create a new record it automatically add
  created at and updated at field */
    timestamps: true,
  }
);

// define OrderModel
// check mongoose.models.Order
const Order =
  mongoose.models.Order || // // OrderModel is already created
  // create the model
  mongoose.model(
    'Order', // model name
    orderSchema // schema
  );
// export model
export default Order;
