import User from '../../../../models/User';
import db from '../../../../utils/db';
import { getSession } from 'next-auth/react';

const handler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // get session from getSession method
  const session = await getSession({
    req, // request
  });

  // check session
  if (
    !session /* if session is not defined */ ||
    /*OR*/ !session.user.isAdmin /* if session.user.isAdmin in not defined */
  ) {
    // return response: status code 401 and send message error 'admin signin required'
    return res.status(401).send('admin signin required');
  }

  // check request method
  if (req.method === 'DELETE') {
    return deleteHandler(
      req, // first parameter: request
      res // second parameter: response
    );
  } else {
    // return response: status code 400 and send message error 'Method not allowed'
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const deleteHandler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // connect to the database
  await db.connect();
  // get product with User.findById that accept a parameter
  const user = await User.findById(
    req.query.id // parameter: id
  );
  // check user
  if (user) {
    /* if user is defined */
    if (user.email === 'admin@example.com') {
      return res.status(400).send({ message: 'Can not delete admin' });
    }
    await user.remove();
    // disconnect from the database
    await db.disconnect();
    res.send({
      message: 'User Deleted',
    });
  } else {
    // otherwise

    // disconnect from the database
    await db.disconnect();
    // return response: status code 404 and send message error 'User not found'
    res.status(404).send({ message: 'User Not Found' });
  }
};
// export
export default handler;
