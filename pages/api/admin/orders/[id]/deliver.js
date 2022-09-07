import { getSession } from 'next-auth/react';
import Order from '../../../../../models/Order';
import db from '../../../../../utils/db';

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
    !session /* if session is false */ ||
    /* Or */ (session /* session does exist */ /* and */ /* and */ &&
      !session.user.isAdmin) //session.user.isAdmin is false
  ) {
    // return response: status code 401 and send message error 'signin required'
    return res.status(401).send('Error: signin required');
  }
  // connect to the database
  await db.connect();

  // get order using Order.findById
  const order = await Order.findById(req.query.id);
  // if order does exist
  if (order) {
    order.isDelivered = true; // set order.isDelivered to true
    // get order.deliveredAt Date.now()
    order.deliveredAt = Date.now();

    // get deliveredOrder from order.save()
    const deliveredOrder = await order.save();
    // disconnect from database
    await db.disconnect();

    // from response call send that accept a object
    res.send({
      message: 'order delivered successfully',
      order: deliveredOrder,
    });
  } else {
    // otherwise
    // disconnect from the database
    await db.disconnect();
    // from response call status 404 and send message: 'Error: order not found'
    res.status(404).send({ message: 'Error: order not found' });
  }
};
// export handler
export default handler;
