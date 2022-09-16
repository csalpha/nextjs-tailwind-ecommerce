import { getSession } from 'next-auth/react';
import User from '../../../../../models/User';
import db from '../../../../../utils/db';

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

  // get the user from the session
  const { user } = session;

  // check request method
  if (req.method === 'GET') {
    // if request  method is equal to 'GET'
    // return getHandler function
    return getHandler(
      req, // first parameter: request
      res, // second parameter: response
      user // third parameter: user
    );
  } else if (req.method === 'DELETE') {
    return deleteHandler(
      req, // first parameter: request
      res // second parameter: response
    );
  } else if (req.method === 'PUT') {
    //if request method is equal to 'PUT'
    // return putHandler function
    return putHandler(
      req, // first parameter: request
      res, // second parameter: response
      user // third parameter: user
    );
  } else {
    // return response: status code 400 and send message error 'Method not allowed'
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

// define getHandler ( async function )
const getHandler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // connect to the database
  await db.connect();
  // get product with User.findById that accept a parameter
  const user = await User.findById(req.query.id);
  // disconnect from the database
  await db.disconnect();
  res.send(user);
};

// define putHandler ( async function )
const putHandler = async (
  req, // first parameter: request
  res // second parameter: response
) => {
  // connecto to the database
  await db.connect();
  // get user with User.findById that accept a parameter
  const user = await User.findById(req.query.id);
  if (user) {
    // if user does exist
    // get user.name from req.body.name
    user.name = req.body.name;
    // get user.email from req.body.email
    user.email = req.body.email;
    // get user.isAdmin from req.body.isAdmin
    user.isAdmin = req.body.isAdmin;
    // get user.isSeller from req.body.isSeller
    user.isSeller = req.body.isSeller;
    // save user
    await user.save();
    // disconnect from the database
    await db.disconnect();
    // call send method that accept a object
    res.send({ message: 'User updated successfully' });
  } else {
    // disconnect from the database
    await db.disconnect();
    // return response: status code 404 and send message error 'User not found'
    res.status(404).send({ message: 'User not found' });
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
