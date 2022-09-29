import User from '../../../../models/User';
import db from '../../../../utils/db';

// define handler ( async function )
// create an api to get the user from backend
const handler = async (
  req, // 1st parameter - request
  res // 2nd parameter - response
) => {
  // connect to the database
  await db.connect();

  /* get user */
  const user = await User.findById(req.params.id);

  // check if is user and isSeller
  if (user && user.isSeller) {
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      seller: user.seller,
    });
  } else {
    res.status(404).send({ message: 'Seller Not Found' });
  }

  // disconnect from the database
  await db.disconnect();

  //return the product to the frontend
  res.send(user);
};

// export handler function
export default handler;
