import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faCircleXmark,
  // faEllipsisH,
  faEllipsisVertical,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios';
/* fixed top-0 left-0 z-40 h-full w-[20rem] bg-gray-300 p-10 duration-300  ease-in-out dark:bg-gray-800 translate-x-0 */

export default function Layout({
  title, // pass title
  children, // pass children
}) {
  /* get status and session from useSession */
  const {
    //it's a flag that showing the loading of session
    status, // get status from useSession
    data: session, // get session from useSession
  } = useSession();
  //while we are loading the session we don't show the user name

  const {
    state, // get  state from useContext
    dispatch, // get dispatch from useContext
  } = useContext(
    Store // pass parameter
  );

  const {
    cart, // get cart from the state
    userInfo, //get userInfo from the state
  } = state;

  // get array from useState
  const [
    cartItemsCount, // [0] - get cart Items Count from useState
    setCartItemsCount, // [1] - set Cart Items Count ( method )
  ] = useState(
    0 // pass 0
  );

  // get array from useState
  const [
    sidebarIsOpen, // [0] - get sidebarIsOpen from useState
    setSidebarIsOpen, // [1] - set Sidebar Is Open ( method )
  ] = useState(
    false // pass false
  );

  // get array from useState
  const [
    sidebarRightIsOpen, // [0] - get sidebarIsOpen from useState
    setSidebarRightIsOpen, // [1] - set Sidebar Is Open ( method )
  ] = useState(
    false // pass false
  );

  const [
    categories, // [0] - get categories from useState
    setCategories, // [1] - setCategories ( method )
  ] = useState(
    [] // pass a empty array
  );

  // define useEffect
  useEffect(
    () => {
      // define fetchCategories function (async function)
      const fetchCategories = async () => {
        try {
          /* send an ajax request to backend using axios.get 
                 to getting data from backend */
          const { data } = await Axios.get(
            `/api/products/categories` // parameter
          );

          // call function
          setCategories(
            data // parameter
          );
          // if there is an error
        } catch (err) {
          // // show toast error
          // toast.error(
          //   getError(
          //     err // parameter of getError method
          //   )
          // ); // parameter of error method
        }
      };
      fetchCategories();

      setCartItemsCount(
        cart.cartItems.reduce(
          (
            a, // 1st param
            c // 2nd param
          ) => a + c.quantity, // 1st param - pass function
          0 //2nd param - pass function
        )
      );
    }, // 1st parameter
    [cart.cartItems, dispatch] // 2nd paramter
  );

  // define logoutClickHandler
  const logoutClickHandler = () => {
    // remove the cart items from react
    Cookies.remove('cart');
    // dispatch 'CART_RESET' action
    dispatch({ type: 'CART_RESET' });
    // call signOut
    signOut({ callbackUrl: '/login' /* set callbackUrl to the login */ });
  };

  // // sidebarIsOpen
  // //   ? (document.body.style.overflow = 'hidden')
  // //   : (document.body.style.overflow = 'auto');

  return (
    <>
      {/* Render Head */}
      <Head>
        {/* Render Title */}
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
      {/* ########### */}

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        {/* Render Header */}
        <header>
          {/* render nav */}
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            {/* Side Bar Left */}
            <a
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              className="p-2"
              type="button"
            >
              <FontAwesomeIcon icon={faBars} />
            </a>

            {/* Nav Title */}
            <Link href="/">
              <a className="text-lg font-bold">Next App</a>
            </Link>
            <div>
              {/* Icon Side Bar Right */}
              <a
                className="p-2"
                onClick={() => setSidebarRightIsOpen(!sidebarRightIsOpen)}
                type="button"
              >
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </a>

              {/* Side Bar Right */}
              {/* check the status */}
              {status === 'loading' ? ( // status it's loading?
                'Loading' // show loading
              ) : session?.user ? (
                // session exists? (true) (
                <div
                  className={
                    sidebarRightIsOpen
                      ? 'fixed top-12 right-0 z-40 h-full w-[20rem] bg-gray-300 p-10 duration-300 ease-in-out dark:bg-gray-800 translate-x-0'
                      : 'hidden'
                  }
                >
                  <p>
                    <a className="">
                      <strong>Menu</strong>
                    </a>
                    <a
                      className="ml-2"
                      onClick={() => setSidebarRightIsOpen(!sidebarRightIsOpen)}
                    >
                      <FontAwesomeIcon icon={faCircleXmark} />
                    </a>
                  </p>
                  <DropdownLink className="dropdown-link" href="/profile">
                    {session.user.name}
                  </DropdownLink>
                  <DropdownLink className="dropdown-link" href="/profile">
                    Profile
                  </DropdownLink>
                  <DropdownLink className="dropdown-link" href="/order-history">
                    Order History
                  </DropdownLink>
                  <DropdownLink className="dropdown-link" href="/cart">
                    Cart
                    {cartItemsCount > 0 && (
                      <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                        {cartItemsCount}
                      </span>
                    )}
                  </DropdownLink>
                  {/* check */}
                  {session.user.isAdmin && ( // if session.user.isAdmin is true
                    /* Create Admin Menu */

                    <DropdownLink
                      className="dropdown-link"
                      href="/admin/dashboard"
                    >
                      Admin Dashboard
                    </DropdownLink>
                  )}

                  <DropdownLink
                    className="dropdown-link"
                    href="/"
                    onClick={logoutClickHandler}
                  >
                    Logout
                  </DropdownLink>

                  <DropdownLink className="dropdown-link" href="#">
                    <FontAwesomeIcon icon={faMoon} />
                  </DropdownLink>
                </div>
              ) : (
                <div
                  className={
                    sidebarRightIsOpen
                      ? 'fixed top-12 right-0 z-40 h-full w-[20rem] bg-gray-300 p-10 duration-300 ease-in-out dark:bg-gray-800 translate-x-0'
                      : 'hidden'
                  }
                >
                  <a className="">
                    <strong>Menu</strong>
                  </a>
                  <a
                    className="ml-2"
                    onClick={() => setSidebarRightIsOpen(!sidebarRightIsOpen)}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </a>
                  <DropdownLink className="dropdown-link" href="/cart">
                    Cart
                    {cartItemsCount > 0 && (
                      <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                        {cartItemsCount}
                      </span>
                    )}
                  </DropdownLink>
                  <DropdownLink className="dropdown-link" href="/login">
                    Login
                  </DropdownLink>
                  <DropdownLink className="dropdown-link" href="#">
                    <FontAwesomeIcon icon={faMoon} />
                  </DropdownLink>
                </div>
              )}
            </div>
          </nav>
        </header>

        {/* render side bar left ( categories )*/}
        <div
          className={
            sidebarIsOpen
              ? 'fixed top-12 left-0 z-40 h-full w-[20rem] bg-gray-300 p-10 duration-300 ease-in-out dark:bg-gray-800 translate-x-0'
              : 'hidden'
          }
        >
          <p></p>
          <a className="ml-2">
            <strong>Categories</strong>
          </a>
          <a className="ml-2" onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </a>

          <p>
            {categories.map((category) => (
              <DropdownLink
                className="dropdown-link"
                key={category}
                href={`/search?category=${category}`}
                // onClick={() => setSidebarIsOpen(false)}
              >
                {category}
              </DropdownLink>
            ))}
          </p>
        </div>

        {/* render main */}
        <main className="container m-auto mt-4 px-4">{children}</main>

        {/* render footer */}
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>
            &copy; {new Date().getFullYear()} {' CARLOS SERODIO '} ALL RIGHTS
            RESERVED
          </p>
        </footer>
      </div>

      {/* if(sidebarIsOpen)
      {
        setSidebarRightIsOpen(!sidebarRightIsOpen)
      }
        
      if(sidebarRightIsOpen)
      {}
        setSidebarIsOpen(!sidebarIsOpen) */}

      {sidebarIsOpen || sidebarRightIsOpen ? (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      ) : (
        <style jsx global>{`
          body {
            overflow: auto;
          }
        `}</style>
      )}
    </>
  );
}
