import Product from '../../../models/Product';
import db from '../../../utils/db';

// define handler ( async function )
// create an api to get the product from backend
const handler = async (
  req, // 1st parameter - request
  res // 2nd parameter - response
) => {
  // connect to the database
  await db.connect();
  /* get the product in the database using find method */
  const categories = await Product.find().distinct('category');
  // disconnect from the database
  await db.disconnect();
  //return the product to the frontend
  res.send(categories);
};

// export handler function
export default handler;
