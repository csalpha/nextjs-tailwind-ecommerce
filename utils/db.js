import mongoose from 'mongoose';

// define connection
const connection = {}; // empty object

// implement connect function
async function connect() {
  //check connection that is connected
  if (connection.isConnected) {
    console.log('already connected');
    //stop the function
    return;
  }

  // check this condiction
  if (mongoose.connections.length > 0) {
    // we have connections in the connection queue
    connection.isConnected = mongoose.connections[0].readyState;
    // readyState = 1, we are connected to the database
    if (connection.isConnected === 1) {
      console.log('use previous connection');
      //stop the function
      return;
    }
    /* if isConnected in not equal to 1, we need to disconnect
    because we are not in connected mode */
    await mongoose.disconnect();
  }

  // connection code
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log('new connection');
  connection.isConnected = db.connections[0].readyState;
}

// implement disconnect function
async function disconnect() {
  //check connection that is connected
  if (connection.isConnected) {
    // true
    //check if we are in production mode
    if (process.env.NODE_ENV === 'production') {
      // call disconnect
      await mongoose.disconnect();
      // set isConnected to false
      connection.isConnected = false;
    } else {
      console.log('not disconnected');
    }
  }
}

// define db object
const db = { connect, disconnect };
export default db;
