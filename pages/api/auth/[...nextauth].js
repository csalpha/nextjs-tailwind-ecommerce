import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../models/User';
import db from '../../../utils/db';

/* every request for sign in and sign out and checking 
 the authentication will be redirected to this file */

// NextAuth is a function that
export default NextAuth({
  // set properties
  session: {
    strategy: 'jwt',
  },

  callbacks: {
    /* the data from the database from the user 
    will be set for token and session */

    // define jwt function
    async jwt({ token, user }) {
      // check user id
      if (user?._id)
        // fill the token with the data from database
        token._id = user._id; // user._id is comming from database
      // token._id is in NextAuth life cycle

      // check if user isAdmin
      if (user?.isAdmin)
        // fill the token with the data from database
        token.isAdmin = user.isAdmin;

      // stop function and return token
      return token;
    },

    // define session function
    async session({ session, token }) {
      if (token?._id)
        // if it exists fill the session with token
        session.user._id = token._id;

      if (token?.isAdmin)
        // if it exists fill the session with token
        session.user.isAdmin = token.isAdmin;

      // stop function and return session
      return session;
    },
  },

  // define the providers - is an array
  providers: [
    // authenticate user based on the mongodb database

    // accept an object
    CredentialsProvider({
      // define authorize function
      async authorize(credentials) {
        // connect to the database
        await db.connect();
        /* find the user in the database based on the email 
        in the credential parameter */
        const user = await User.findOne({
          email: credentials.email,
        });
        // disconnect
        await db.disconnect();

        // check the user and password
        /* if user exists*/
        /* the password that user entered in the textbox
        is equal to the password in the database? */
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            // object is comming from the database ( user collection)
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          };
        }
        // if the email/password is incorrect
        throw new Error('Invalid email or password');
      },
    }),
  ],
});
