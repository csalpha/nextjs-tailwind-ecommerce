import {
  getSession /* return paypal clientId only for authenticated user */,
} from 'next-auth/react';

// Create paypal api

// define handler function ( async function )
const handler = async (req, res) => {
  // get the session from getSession
  const session = await getSession({ req });
  // check session
  if (!session) {
    /* if session doesn't exist
     return error message 'signin required'*/
    return res.status(401).send('signin required');
  }
  // show the PAYPAL_CLIENT_ID inside the environement variable
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
};

// export handler
export default handler;
