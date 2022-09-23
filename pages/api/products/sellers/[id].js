import Product from '../../../../models/Product';
import db from '../../../../utils/db';

// define handler ( async function )
// create an api to get the product from backend
const handler = async (
  { params }, // 1st parameter - params
  res // 2nd parameter - response
) => {
  // connect to the database
  await db.connect();
  /* get the product in the database using findById method 
  and using the id in the url, to get the product in the 
  database based on the id in the url '/api/products/id' */
  const products = await Product.find({
    seller: params.id, // pass params.id
  }).populate(
    'seller', // 1st parameter - pass 'seller'
    'seller.name seller.logo seller.rating seller.numReviews' // 2nd parameter
  );

  // disconnect from the database
  await db.disconnect();
  //return the product to the frontend
  res.send(products);
};

// export handler function
export default handler;
