import { getSession } from 'next-auth/react';
import Product from '../../../../../models/Product';
import db from '../../../../../utils/db';

// define handler ( async function )
const handler = async (
  req, // request
  res // response
) => {
  // get session using getSession method that accept an object
  const session = await getSession({
    req, // request
  });

  // check session
  if (
    !session /* if session is false */ /*OR*/ ||
    (session /* if session is true */ /*AND */ &&
      !session.user.isAdmin) /*!session.user.isAdmin is false */
  ) {
    // return response: status code 401 and send message error 'signin required'
    return res.status(401).send('signin required');
  }

  // get the user from the session
  const { user } = session;
  // check request method
  if (req.method === 'GET') {
    // if request  method is equal to 'GET'
    // return getHandler function
    return getHandler(
      req, // first parameter: request
      res, // second parameter: response
      user // third parameter: user
    );
  } else if (req.method === 'PUT') {
    //if request method is equal to 'PUT'
    // return putHandler function
    return putHandler(
      req, // first parameter: request
      res, // second parameter: response
      user // third parameter: user
    );
  } else if (req.method === 'DELETE') {
    // check request method
    return deleteHandler(
      req, // first parameter: request
      res, // second parameter: response
      user // third parameter: user
    );
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
// define getHandler ( async function )
const getHandler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // connect to the database
  await db.connect();
  // get product with Product.findById that accept a parameter
  const product = await Product.findById(req.query.id);
  // disconnect from the database
  await db.disconnect();
  res.send(product);
};
// define putHandler ( async function )
const putHandler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // connecto to the database
  await db.connect();

  // get product with Product.findById that accept a parameter
  const product = await Product.findById(req.query.id);

  // check product is defined
  if (product) {
    // if product does exist
    // get product.name from req.body.name
    product.name = req.body.name;
    // get product.slug from req.body.slug
    product.slug = req.body.slug;
    // get product.price from req.body.price
    product.price = req.body.price;
    // get product.category from req.body.category
    product.category = req.body.category;
    // get product.image from req.body.image
    product.image = req.body.image;
    // get product.brand from req.body.brand
    product.brand = req.body.brand;
    // get product.countInStock from req.body.countInStock
    product.countInStock = req.body.countInStock;
    // get product.description from req.body.description
    product.description = req.body.description;
    // save product
    await product.save();
    // disconnect from the database
    await db.disconnect();

    // call send method that accept a object
    res.send({ message: 'Product updated successfully' });
  } else {
    // disconnect from the database
    await db.disconnect();
    // return response: status code 404 and send message error 'Product not found'
    res.status(404).send({ message: 'Product not found' });
  }
};

// define deleteHandler ( async function )
const deleteHandler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // connect to the database
  await db.connect();
  // get product using Product.findById
  const product = await Product.findById(
    req.query.id // parameter: id
  );
  // check product
  if (product) {
    // if product is defined
    // call remove method
    await product.remove();
    // disconnect from the database
    await db.disconnect();

    /* call send method 
    parameter: object*/
    res.send({
      message: 'Product deleted successfully',
    });
  }
  // otherwise
  else {
    /* disconnect from the database */
    await db.disconnect();
    // response status code 404, send message 'Product not found'
    res.status(404).send({
      message: 'Product not found',
    });
  }
};

// export handler
export default handler;
