import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import { StoreProvider } from '../utils/Store';
import { useRouter } from 'next/router';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function MyApp({
  Component,
  pageProps: { session, ...pageProps /* rest of pageProps*/ },
}) {
  return (
    // wrap StoreProvider with SessionProvider
    // pass the session (is comming from the pageProps ) to SessionProvider
    // we can have the session in all pages
    <SessionProvider session={session}>
      <StoreProvider>
        {/* Define PayPalScriptProvider  and make deferLoading to true */}
        <PayPalScriptProvider deferLoading={true}>
          {/* Check Component.auth */}
          {Component.auth ? ( // if it's true render <Auth> Component
            /* set adminOnly to Component.auth.adminOnly  */
            <Auth adminOnly={Component.auth.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            // otherwise render the component as it is
            <Component {...pageProps} />
          )}
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

// implement Auth function
function Auth(
  { children, adminOnly } /* pass object with children and adminOnly */
) {
  // get the router from useRouter()
  const router = useRouter();
  // useSession Hook
  const { status, data: session /* get session from useSession hook */ } =
    useSession({
      // only logged in user can access to it
      required: true, // set required to true

      // if the user does not login:
      onUnauthenticated() {
        // redirect to unauthorized page, set the message to login required
        router.push('/unauthorized?message=login required');
      },
    });

  /* check the status */
  if (status === 'loading') {
    // if it's loading
    return <div>Loading...</div>; // Show loading
  }

  if (adminOnly /* if adminOnly is true  */ && !session.user.isAdmin) {
    /* and session.user.isAdmin isn't true */
    // redirect to unauthorized page, set the message to admin login required
    router.push('/unauthorized?message=admin login required');
  }

  // if it's not loading show the children Component
  return children;
}

// export MyApp
export default MyApp;
