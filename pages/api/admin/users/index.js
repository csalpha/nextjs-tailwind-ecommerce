import { getSession } from 'next-auth/react';
import User from '../../../../models/User';
import db from '../../../../utils/db';

// define handler ( async function )
const handler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // get session using getSession method that accept an object
  const session = await getSession({
    req, // parameter: request
  });

  // check session
  if (
    !session /* session is not defined */ /* OR */ ||
    !session.user.isAdmin // session.user.isAdmin is not defined
  ) {
    // return response: status code 401 and send message error 'admin signin required'
    return res.status(401).send('admin signin required');
  }
  // connect to the database
  await db.connect();

  // get users using User.find
  const users = await User.find(
    {} // empty object
  );
  await db.disconnect();

  // send users
  res.send(
    users // parameter: users object
  );
};

// export
export default handler;
