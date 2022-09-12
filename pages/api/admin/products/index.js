import { getSession } from 'next-auth/react';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

// define handler (async function)
const handler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // get session using getSession method that accept an object
  const session = await getSession({
    req, // request
  });

  // check session
  if (
    !session /* if session is false */ || // OR
    !session.user.isAdmin /*!session.user.isAdmin is false */
  ) {
    // return response: status code 401 and send message error 'signin required'
    return res.status(401).send('admin signin required');
  }
  // const { user } = session;
  // check request method
  if (req.method === 'GET') {
    // if request method is equal to 'GET'
    return getHandler(
      req, // 1st param: rquest
      res // 2nd param: response
    );
  }
  // check request method
  else if (req.method === 'POST') {
    // if it's 'POST'
    // return postHandler ( async funtion )
    return postHandler(
      req, // 1st param: rquest
      res // 2nd param: response
    );
  } else {
    // return response: status code 400 and send message error 'Method not allowed'
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

// define postHandler ( async function )
const postHandler = async (
  req, // request
  res // response
) => {
  // connect to database
  await db.connect();

  // create new product
  const newProduct = new Product({
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    description: 'sample description',
    rating: 0,
    numReviews: 0,
  });

  // save product
  const product = await newProduct.save();
  // disconnect from the database
  await db.disconnect();
  // call send method
  res.send({
    message: 'Product created successfully', // 1st param
    product, // 2nd param
  });
};

// define getHandler ( async function )
const getHandler = async (
  req, // request
  res // response
) => {
  // connect to the database
  await db.connect();
  // get  products using Product.find
  const products = await Product.find(
    {} // empty object
  );
  // disconnect from the database
  await db.disconnect();
  // from response call send method, and pass products
  res.send(products);
};

// export handler
export default handler;
