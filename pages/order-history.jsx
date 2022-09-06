import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
// getError is coming from '../utils/error'
import { getError } from '../utils/error';

// define reducer function
function reducer(state, action) {
  // use switch case to check the action.type
  switch (action.type) {
    // if it's 'FETCH_REQUEST'
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true, // set loading to true
        error: '', // set error to empty string
      };
    // if it's 'FETCH_SUCCESS'
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false, // set  loading to false
        orders: action.payload, // fill the orders with data from backend
        error: '',
      };
    // if ther is an error
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false, // set loading to false
        error: action.payload, // fill error with the payload in the action
      };
    // define default case
    default:
      // return state as it is
      return state;
  }
}
function OrderHistoryScreen() {
  // define useReducer
  const [
    /* first parameter: object that contains: loading, error, orders */
    { loading, error, orders },
    dispatch, // second parameter: dispatch to change the state of { loading, error, orders }
  ] = useReducer(
    reducer, // first parameter: reducer function
    {
      loading: true, // set loading to true
      orders: [], // set orders to empty array
      error: '', // set error to empty string
    } // second parameter: object with default values
  );

  /* define useEffect because we are send an ajax request 
  to backend to get list of orders */
  useEffect(
    () => {
      // in the function define fetchOrders ( async function )
      const fetchOrders = async () => {
        // define trycatch
        try {
          dispatch({
            type: 'FETCH_REQUEST', // dispatch 'FETCH_REQUEST' action
          });
          // send an ajax request using axios.get to address: `/api/orders/history`
          // call api on page load using useEffect
          const { data } = await axios.get(`/api/orders/history`);
          // { data } contains all orders
          /* dispatch 'FETCH_SUCCESS' action and pass the data from backend
             as payload to fetch success action */
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          //if there is an error
          dispatch({
            type: 'FETCH_FAIL', //dispatch 'FETCH_FAIL' action
            payload: getError(err) /* payload is the error message 
            passed to the get error function */,
          }); //
        }
      };
      // call fetchOrders ( async function )
      fetchOrders();
    }, // first parameter: function
    [] // second parameter: empty array
  );
  return (
    // Order History Screen
    /* use Layout, set title to Order History */
    <Layout title="Order History">
      {/* set heading one to order History
      set text-extra-large */}
      <h1 className="mb-4 text-xl">Order History</h1>
      {/* Condictional rendering */}
      {loading ? ( // if loading does exist
        // show loading div
        <div>Loading...</div>
      ) : error ? ( // if error does exist
        // show error message
        <div className="alert-error">{error}</div>
      ) : (
        // otherwise
        /* create a div and set overflow-x-auto for smaller screen 
        (you can scroll horizontally to see all cells of the table ) */
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* create table head, and set the border */}
            <thead className="border-b">
              {/* create a table row with 6 cells */}
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="p-5 text-left">DATE</th>
                <th className="p-5 text-left">TOTAL</th>
                <th className="p-5 text-left">PAID</th>
                <th className="p-5 text-left">DELIVERED</th>
                <th className="p-5 text-left">ACTION</th>
              </tr>
            </thead>
            {/* create table body */}
            <tbody>
              {/* use orders.map to convert each order to a table row  */}
              {orders.map((order) => (
                /* set the key */
                <tr key={order._id} className="border-b">
                  {/* use substring to only show last four characters of the id */}
                  <td className=" p-5 ">{order._id.substring(20, 24)}</td>
                  {/* use substrong to only show the date no the time part of the order */}
                  <td className=" p-5 ">{order.createdAt.substring(0, 10)}</td>
                  {/* order.totalPrice*/}
                  <td className=" p-5 ">{order.totalPrice} €</td>
                  <td className=" p-5 ">
                    {/* check is paid */}
                    {order.isPaid // if isPaid is true
                      ? // show the date of the payment
                        `${order.paidAt.substring(0, 10)}`
                      : // otherwise
                        // the message is 'not paid'
                        'not paid'}
                  </td>
                  <td className=" p-5 ">
                    {order.isDelivered // if isDelivered is true
                      ? // show the date of the Deliver
                        `${order.deliveredAt.substring(0, 10)}` // otherwise
                      : // the message is 'not delivered'
                        'not delivered'}
                  </td>
                  <td className=" p-5 ">
                    {/* use Link */}
                    <Link
                      href={`/order/${order._id}`} //set href to `/order/${order._id}`
                      passHref // use passHref to pass it to the anchor here <a></a>
                    >
                      <a>Details</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

// only the authenticated user can access the OrderHistoryScreen
// set OrderHistoryScreen to authenticate it
OrderHistoryScreen.auth = true;

// export OrderHistoryScreen
export default OrderHistoryScreen;
