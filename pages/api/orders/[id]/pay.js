import { getSession } from 'next-auth/react';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

// create handler function
const handler = async (req, res) => {
  // get session from getSession method
  const session = await getSession({ req });

  // check session
  if (!session) {
    // if session is null
    // show signin error message
    return res.status(401).send('Error: signin required');
  }

  //connect to the database
  await db.connect();

  // find the order in the url
  const order = await Order.findById(req.query.id);
  // check the order
  if (order) {
    // if order exist
    if (order.isPaid) {
      // and if the order is already pay
      // return this error message
      return res.status(400).send({ message: 'Error: order is already paid' });
      // so there is no need to pay that order again
    }
    // otherwise
    order.isPaid = true; // set isPaid to true
    order.paidAt = Date.now(); // set paidAt
    /* set id, status and email_address 
    data is coming from paypal */
    order.paymentResult = {
      id: req.body.id, //  set id from the paypal
      status: req.body.status, // set status
      email_address: req.body.email_address, // set email_address
    };

    // save the order and set it inside the paidOrder
    const paidOrder = await order.save();
    // disconnect from the database
    await db.disconnect();
    // show message 'order paid successfully'
    res.send({ message: 'order paid successfully', order: paidOrder });
  } else {
    // if the order does not found
    //disconnect from the database
    await db.disconnect();
    // show error message 'Error: order not found'
    res.status(404).send({ message: 'Error: order not found' });
  }
};

export default handler;
