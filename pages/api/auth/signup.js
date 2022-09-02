import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';

// implement signup api
// this api only accept post http web
// create a api to create a user in the database

// define async function named handler
async function handler(req, res) {
  // check the method of this request
  if (req.method !== 'POST') {
    // if method is not post
    return; // stop function
  }
  // from req.body get name, email and password
  const { name, email, password } = req.body;
  // if the data does not exist
  if (
    !name || // if name does not exist
    !email || // if email does not exist
    !email.includes('@') || // if email does not includes '@'
    !password || // if password does not exist
    password.trim().length < 3 // if password is less than 3
  ) {
    /* return error 422 
    and send a json with a message */
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  // connect to the database
  await db.connect();

  /* by findOne we search in the user collection mongodb for
   the user with this email*/
  const existingUser = await User.findOne({ email: email });
  // if does exist
  if (existingUser) {
    // show error message status 422
    res.status(422).json({ message: 'User exists already!' });
    // disconnect from the database
    await db.disconnect();
    // don't continue the code
    return;
  }
  /* otherwise define a  newUser from the User
  object from mongoose and pass name, email, password and is admin */
  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password), // use bcryptjs to encrypt the password
    isAdmin: false,
  });

  // create user using newUser.save() function from mongoose
  const user = await newUser.save();
  // disconnect from the database
  await db.disconnect();
  /* send back this data 
  status is 201 and send message 'Created user!'*/
  res.status(201).send({
    message: 'Created user!',
    _id: user._id, // pass id of user
    name: user.name, // pass name of user
    email: user.email, // pass email of user
    isAdmin: user.isAdmin, // pass isAdmin status
  });
}

// export handler function
export default handler;
