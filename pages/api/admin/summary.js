import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';
import db from '../../../utils/db';

// Implement admin summary api

// define handler ( async function )
const handler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // get session from getSession
  const session = await getSession({ req });
  console.log(session);

  if (
    !session || // if session does not exist // Or
    (session && // session does exist // And
      !session.user.isAdmin) // session.user.isAdmin is false
  ) {
    // return status code 401 and send message error: 'signin required'
    return res.status(401).send('signin required');
  }
  // connect to database
  await db.connect();

  // get ordersCount using Order.countDocuments() method
  const ordersCount = await Order.countDocuments();
  // get productsCount using Product.countDocuments() method
  const productsCount = await Product.countDocuments();
  // get usersCount using User.countDocuments() method
  const usersCount = await User.countDocuments();
  // get ordersPriceGroup using Order.aggregate() method
  // aggregate accept a  array with an object inside
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null, // set _id to null
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);

  // get ordersPrice
  const ordersPrice =
    ordersPriceGroup.length > 0 // if ordersPriceGroup.length > 0
      ? /* ordersPrice = ordersPriceGroup[0].sales */
        ordersPriceGroup[0].sales
      : /* otherwise: ordersPrice = 0 */ 0;

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  // disconnect from the database
  await db.disconnect();
  // response: send an object { ordersCount, productsCount, usersCount, ordersPrice, salesData }
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
};

// export handler
export default handler;
