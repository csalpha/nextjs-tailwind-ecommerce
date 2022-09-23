import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Create Product Model

// Create a product Schema using new mongoose.Schema
const productSchema = new mongoose.Schema(
  // accept an object as a parameter
  {
    // list the fields of product
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    image: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
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
  // // ProductModel is already created
  mongoose.models.Product ||
  // create the model
  mongoose.model(
    'Product', // model name
    productSchema // schema
  );

// export model
export default Product;
