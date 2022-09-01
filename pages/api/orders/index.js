import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import db from '../../../utils/db';

// create order api

// define handler async function
const handler = async (req, res) => {
  // check the authentication using getSession
  const session = await getSession({ req });
  if (!session) {
    /* if session doesn't exist
       return message: 'signin required' 
       status code for this api is 401 */
    return res.status(401).send('signin required');
  }
  /* otherwise get the user from the session */
  const { user } = session;
  // connect to the database
  await db.connect();
  /* create a new order based on the data 
     in the payload in the req.body,
     also fill the user with the user._id from the session */
  const newOrder = new Order({
    ...req.body,
    user: user._id,
  });
  // save order
  const order = await newOrder.save();
  /* send back status code: 201
     and the message is the order object in the database */
  res.status(201).send(order);
};

// export handler
export default handler;
