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
      req, // request
      res // response
    );
  } else {
    // return response: status code 400 and send message error 'Method not allowed'
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

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
