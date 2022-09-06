import { getSession } from 'next-auth/react';
import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';

// implement update api
// this api only accept put method
// create a api to update the user in the database

// define handler function
async function handler(
  req, // 1st parameter: request
  res // 2nd parameter: response
) {
  if (req.method !== 'PUT') {
    // if eq.method is not equal to 'PUT'
    // return response status code 400 and send message: "request method not supported"
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  // get the session from the getSession method
  const session = await getSession({ req });

  if (!session) {
    // if session is null
    // return status 401 error message
    return res.status(401).send({ message: 'signin required' });
  }

  // get the user from the session
  const { user } = session;
  // get name, email and password from req.body
  const { name, email, password } = req.body;

  if (
    !name || // if name does not exist
    !email || // if email does not exist
    !email.includes('@') || // if email does not includes @
    (password && password.trim().length < 4) // trim method removes whitespace // length < 4
    /* if password exist and
     */
  ) {
    // status code 422 error message 'Validation error'
    res.status(422).json({
      message: 'Validation error',
    });
    // the code after the return statement will be unreachable
    return;
  }

  // connect to the database
  await db.connect();

  /* use findById function on User and filter users by the user id
  inside the session */
  const toUpdateUser = await User.findById(user._id);

  toUpdateUser.name = name; // fill toUpdateUser.name with name
  toUpdateUser.email = email; // fill toUpdateUser.email with email

  if (password) {
    // if password does exist
    // fill toUpdateUser.password with  bcryptjs.hashSync(password)
    toUpdateUser.password = bcryptjs.hashSync(password);
  }
  //

  await toUpdateUser.save(); // save toUpdateUser
  await db.disconnect(); // disconnect from the database
  //response: send message 'User updated'
  res.send({
    message: 'User updated',
  });
}
// export handler
export default handler;
