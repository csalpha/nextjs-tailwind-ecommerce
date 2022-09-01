import Product from '../../../models/Product';
import db from '../../../utils/db';

// define handler ( async function )
// create an api to get the product from backend
const handler = async (req, res) => {
  // connect to the database
  await db.connect();
  /* get the product in the database using findById method 
  and using the id in the url, to get the product in the 
  database based on the id in the url '/api/products/id' */
  const product = await Product.findById(
    req.query.id // contains product id
  );
  // disconnect from the database
  await db.disconnect();
  //return the product to the frontend
  res.send(product);
};

// export handler function
export default handler;
