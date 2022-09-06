import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import db from '../../../utils/db';

// implement api

// define handler ( async function )
const handler = async (req, res) => {
  // get session from getSession method
  const session = await getSession({ req });
  // check the session
  if (!session) {
    // if session is null
    // return status 401 error message 'signin required'
    return res.status(401).send({
      message: 'signin required', //pass as json not a simple string
    });
  }

  /* if user session exists connect to the database
  get the orders for current user and disconnect */

  // if the session exists
  const { user } = session; // get the user from the session
  // connect to the database
  await db.connect();

  /* use find function on Order and filter orders by the user id
  inside the session */
  const orders = await Order.find({ user: user._id });
  // disconnect from the database
  await db.disconnect();

  // send orders back to the client
  res.send(orders);
};

// export handler
export default handler;
