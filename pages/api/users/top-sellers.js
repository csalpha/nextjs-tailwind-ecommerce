import User from '../../../models/User';
import db from '../../../utils/db';

// define handler ( async function )
// create an api to get the user from backend
const handler = async (
  req, // 1st parameter - request
  res // 2nd parameter - response
) => {
  // connect to the database
  await db.connect();

  /* get topSellers */
  const topSellers = await User.find({ isSeller: true })
    .sort({ 'seller.rating': -1 })
    .limit(3);

  // disconnect from the database
  await db.disconnect();

  //return the product to the frontend
  res.send(topSellers);
};

// export handler function
export default handler;
