import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import {
// //   faBars,
// //   faCircleXmark,
// //   faEllipsisVertical,
// //   faMoon,
// // } from '@fortawesome/free-solid-svg-icons';
// // // import Axios from 'axios';

export default function Layout({ title, children }) {
  /* get status and session from useSession */
  const {
    status, //it's a flag that showing the loading of session
    data: session,
  } = useSession();
  //while we are loading the session we don't show the user name

  // get the state, dispatch from useContext
  const { state, dispatch } = useContext(Store);
  // get cart from the state
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  // define logoutClickHandler
  const logoutClickHandler = () => {
    // remove the cart items from react
    Cookies.remove('cart');
    // dispatch 'CART_RESET' action
    dispatch({ type: 'CART_RESET' });
    // call signOut
    signOut({ callbackUrl: '/login' /* set callbackUrl to the login */ });
  };

  return (
    <>
      <Head>
        <title>
          {title /* title is defined */
            ? /* render */
              title + ' - Next App'
            : /* otherwise*/
              /* render */
              'Next App'}
        </title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            {/* <a
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              className="p-2"
              type="button"
            >
              <FontAwesomeIcon icon={faBars} />
            </a> */}
            <Link href="/">
              <a className="text-lg font-bold">Next App</a>
            </Link>
            <div>
              <Link href="/cart">
                <a className="p-2">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {/* check the status */}
              {status === 'loading' ? ( // status it's loading?
                'Loading' // show loading
              ) : session?.user ? ( // session exists? (true)
                /* add Menu from headless ui */
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {/* check */}
                    {session.user.isAdmin && ( // if session.user.isAdmin is true
                      /* Create Admin Menu */
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                /* show a link to the login page */
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}

              {/* <a className="p-2">
                <FontAwesomeIcon icon={faMoon} />
              </a> */}

              {/* <a className="p-2">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </a> */}
            </div>
          </nav>
        </header>

        {/* side bar */}
        <div
          className={
            sidebarIsOpen
              ? ' active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          {/* <div
          className={
            sidebarIsOpen
              ? ' fixed top-0 left-0 z-40 h-full w-[20rem] bg-gray-300 p-10 duration-300  ease-in-out dark:bg-gray-800 translate-x-0'
              : 'hidden'
          }
        > */}
          {/* fixed top-0 left-0 z-40 h-full w-[20rem] bg-gray-300 p-10 duration-300  ease-in-out dark:bg-gray-800 translate-x-0 */}
          {/* <nav className="flex-column text-white w-100 p-2">
            <a className="">Categories</a>
            <a
              className="ml-2"
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </a>
            <p>
              <a>Consoles</a>
            </p>
          </nav> */}
        </div>

        <main
          onClick={() => setSidebarIsOpen(false)}
          className="container m-auto mt-4 px-4"
        >
          {children}
        </main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>
            &copy; {new Date().getFullYear()} Copyright:{' Carlos Serôdio'}
          </p>
        </footer>
      </div>
    </>
  );
}
