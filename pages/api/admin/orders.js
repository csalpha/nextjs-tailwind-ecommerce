import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import db from '../../../utils/db';

// create orders api

// define handler (async function)
const handler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // get session using getSession method that accept an object
  const session = await getSession({
    req, // request
  });

  if (
    !session || // if session is false // or
    (session && // session is true // and
      !session.user.isAdmin) // session.user.isAdmin is false
  ) {
    // return response: status code 401 and send message error 'signin required'
    return res.status(401).send('signin required');
  }

  // check request method
  if (req.method === 'GET') {
    // request method is GET ?
    // connect to the database
    await db.connect();

    /* get orders using Order.find that get a empty object and populate 
    user and name*/
    const orders = await Order.find({}).populate(
      'user', // first parameter
      'name' // second parameter
    );

    // disconnect from the database
    await db.disconnect();
    // call send method of response and send orders
    res.send(orders);
  } else {
    // otherwise
    // call status code 400 and send message: 'Method not allowed'
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
// export handler
export default handler;
