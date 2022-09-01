import mongoose from 'mongoose';

// Create Product Model

// Create a product Schema using new mongoose.Schema
const productSchema = new mongoose.Schema(
  // accept an object as a parameter
  {
    // list the fields of product
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
  },
  {
    /* when we create a new record it automatically add
  created at and updated at field */
    timestamps: true,
  }
);

// define ProductModel
// check mongoose.models.Product
const Product =
  mongoose.models.Product || // // ProductModel is already created
  // create the model
  mongoose.model(
    'Product', // model name
    productSchema // schema
  );
// export model
export default Product;
