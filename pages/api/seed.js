// imports
import User from '../../models/User';
import Product from '../../models/Product';
import data from '../../utils/data';
import db from '../../utils/db';

// ########################################
// Create Seed Api to insert sample users
// define handler function
const handler = async (req, res) => {
  // call db.connect
  await db.connect();
  /* call User.deleteMany
  delete all previous user in the user collection */
  await User.deleteMany();
  /* call User.insertMany 
  for add sample users */
  /* insert users in the data.js */
  await User.insertMany(
    data.users /* is coming from data in the utils folder 
    and the users in the data */
  );
  /* call User.deleteMany
  delete all previous user in the user collection */
  await Product.deleteMany();
  /* call User.insertMany 
  for add sample users */
  /* insert users in the data.js */
  await Product.insertMany(
    data.products /* is coming from data in the utils folder 
    and the users in the data */
  );
  /* call disconnect */
  await db.disconnect();
  /* after finishing database operation and send this message */
  res.send({ message: 'seeded successfully' });
};

// export handler function
export default handler;
