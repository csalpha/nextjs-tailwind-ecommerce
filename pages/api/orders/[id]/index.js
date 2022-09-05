// /api/orders/:id
// code for backend api
/* [id] is a parameter and we are going to get 
   the id at this address: ' /api/orders/:id' */
import { getSession } from 'next-auth/react';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

/* handler is an async function that accept
   request and response as parameter */
const handler = async (req, res) => {
  /* get the current user using getSession function from next-auth */
  const session = await getSession({ req }); // pass request as parameter
  if (!session) {
    /* if session is null or undefined
       send status code: 401
       and message 'signin required' */
    return res.status(401).send('signin required');
  }
  /* if everything is ok, and user is logged in
     connect to the database */
  await db.connect();
  /* on Order object from mongoose model,
     call findById function and pass the id in the url, 
     to get access to this id, we user req.query.id,
     save id in order object */
  const order = await Order.findById(req.query.id);
  // disconnect from the database
  await db.disconnect();
  // send back order to the frontend
  res.send(order);
};
// export handler
export default handler;
