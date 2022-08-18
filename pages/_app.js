import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { StoreProvider } from '../utils/Store';

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
        <Component {...pageProps} />
      </StoreProvider>
    </SessionProvider>
  );
}

export default MyApp;
