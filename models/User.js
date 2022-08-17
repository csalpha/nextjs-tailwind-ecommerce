import mongoose from 'mongoose';

// Create a Schema using new mongoose.Schema
const userSchema = new mongoose.Schema(
  // accept an object as a parameter
  {
    // list the fields of user
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: false, required: true },
    seller: {
      name: String,
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
    },
  },
  {
    /* when we create a new record it automatically add
    created at and updated at field */
    timestamps: true,
  }
);

// define UserModel
// check mongoose.models.User
const User =
  mongoose.models.User || // UserModel is already created
  // create the model
  mongoose.model(
    'User', // model name
    userSchema // schema
  );
export default User;
