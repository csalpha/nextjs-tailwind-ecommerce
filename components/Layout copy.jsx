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
          {/* render */}
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <a
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              className="p-2"
              type="button"
            >
              <FontAwesomeIcon icon={faBars} />
            </a>
            <Link href="/">
              <a className="text-lg font-bold">Next App</a>
            </Link>
            <div>
              {/* <Link href="/cart">
                <a className="p-2">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link> */}

              {/* check the status */}
              {status === 'loading' ? ( // status it's loading?
                'Loading' // show loading
              ) : //otherwise
              session?.user ? ( // session exists? (true)
                /* add Menu from headless ui */

                <Menu as="div" className="">
                  <Menu.Button className="text-blue-600">
                    <a className="p-2">
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </a>
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        {session.user.name}
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/cart">
                        Cart
                        {cartItemsCount > 0 && (
                          <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                            {cartItemsCount}
                          </span>
                        )}
                      </DropdownLink>
                    </Menu.Item>
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
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="#">
                        <FontAwesomeIcon icon={faMoon} />
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                /* show a link to the login page */
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    <a className="p-2">
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </a>
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/cart">
                        Cart
                        {cartItemsCount > 0 && (
                          <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                            {cartItemsCount}
                          </span>
                        )}
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/login">
                        Login
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="#">
                        <FontAwesomeIcon icon={faMoon} />
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>

                // <Link href="/login">
                //   <a className="p-2">Login</a>
                // </Link>
              )}

              {/* <a className="p-2">
                <FontAwesomeIcon icon={faMoon} />
              </a> */}
            </div>
          </nav>
        </header>

        {/* render side bar ( categories )*/}
        <div
          className={
            sidebarIsOpen // sidebarIsOpen is defined
              ? // set className text
                ' fixed top-0 left-0 z-40 h-full w-[20rem] bg-gray-300 p-10 duration-300  ease-in-out dark:bg-gray-800 translate-x-0'
              : // otherwise
                // set className text
                'hidden'
          }
        >
          <a className="">
            <strong>Categories</strong>
          </a>
          <a className="ml-2" onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </a>
          <p>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/search?category=${category}`}
                // onClick={() => setSidebarIsOpen(false)}
              >
                {category}
              </Link>
            ))}
            {/* <Link onClick={() => setSidebarIsOpen(!sidebarIsOpen)} href="/">
              Consoles
            </Link> */}
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
    </>
  );
}

{
  /* <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
  <div class="container flex flex-wrap justify-between items-center mx-auto">
  <a href="https://flowbite.com/" class="flex items-center">
      <img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo">
      <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
  </a>
  <div class="flex md:order-2">
    <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1">
      <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
      <span class="sr-only">Search</span>
    </button>
    <div class="hidden relative md:block">
      <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <svg class="w-5 h-5 text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Search icon</span>
      </div>
      <input type="text" id="search-navbar" class="block p-2 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search...">
    </div>
    <button data-collapse-toggle="navbar-search" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-search" aria-expanded="false">
      <span class="sr-only">Open menu</span>
      <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button>
  </div>
    <div class="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="navbar-search">
      <div class="relative mt-3 md:hidden">
        <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
        </div>
        <input type="text" id="search-navbar" class="block p-2 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search...">
      </div>
      <ul class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <a href="#" class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">Home</a>
        </li>
        <li>
          <a href="#" class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
        </li>
        <li>
          <a href="#" class="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
        </li>
      </ul>
    </div>
  </div>
</nav> */
}
