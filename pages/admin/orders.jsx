import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

/* define reducer that accept two parameters */
function reducer(state, action) {
  // define switch case
  switch (action.type) {
    /* case action.type is 'FETCH_REQUEST' */
    case 'FETCH_REQUEST':
      return {
        ...state, // keep previous state
        loading: true, // set loading to true
        error: '', // set error to empty string
      };
    /* case action.type is 'FETCH_SUCCESS' */
    case 'FETCH_SUCCESS':
      return {
        ...state, // keep previous state
        loading: false, // set loading to false
        orders: action.payload, // orders is coming from action.payload+
        error: '', // set error to empty string
      };
    /* case action.type is 'FETCH_FAIL' */
    case 'FETCH_FAIL':
      return {
        ...state, // keep previous state
        loading: false, // set loading to false
        error: action.payload, // error is coming from the action.payload
      };
    // default case
    default:
      // return state as it is
      state;
  }
}

// export AdminOrderScreen function
export default function AdminOrderScreen() {
  // define a reducer using useReducer hook
  // first: get { loading, error, orders } from  the reducer hook
  // second: get dispatch from the reducer hook, to dispatch actions
  const [{ loading, error, orders }, dispatch] = useReducer(
    reducer, // first parameter: reducer
    {
      loading: true, // set loading to true
      orders: [], // set orders to empty array
      error: '', // set error to empty string
    } // second parameter: an object
  );

  /* define useEffect, because we gonna send
  an ajax request to backend on page load */
  useEffect(
    () => {
      // define fetchData function (async function)
      const fetchData = async () => {
        try {
          // dispatch FETCH_REQUEST action.type
          dispatch({ type: 'FETCH_REQUEST' /* action.type */ });
          /* send an ajax request to backend using axios.get 
           to getting the admin orders from backend */
          const { data } = await axios.get(`/api/admin/orders`);
          // dispatch FETCH_SUCCESS action.type
          dispatch({
            type: 'FETCH_SUCCESS', //action.type
            payload: data, // pass data of the orders as a payload
          });
          // if there is an error
        } catch (err) {
          // dispatch FETCH_FAIL action.type
          dispatch({
            type: 'FETCH_FAIL', //action.type
            payload: getError(err) /* payload is getError 
            pass err to get the correct error message
            from the error object */,
          });
        }
      };
      // call fetchData
      fetchData();
    }, // first parameter: function with fetchdata inside
    [] // second parameter: empty array
  );

  return (
    /* use Layout, set title to Admin Dashboard */
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          {/* create ul */}
          <ul>
            {/* first li */}
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            {/* second li */}
            <li>
              <Link href="/admin/orders">
                <a className="font-bold">Orders</a>
              </Link>
            </li>
            {/* third li */}
            <li>
              <Link href="/admin/products">Products</Link>
            </li>
            {/* fourth li */}
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          {/* set heading one to Admin Orders 
          set text-extra-large */}
          <h1 className="mb-4 text-xl">Admin Orders</h1>
          {/* Condictional rendering */}
          {loading ? ( // if loading does exist
            // show loading div
            <div>Loading...</div>
          ) : error ? ( // if error does exist
            // show error message
            <div className="alert-error">{error}</div>
          ) : (
            // otherwise
            <div className="overflow-x-auto">
              {/* create a table */}
              <table className="min-w-full">
                {/* create table head */}
                <thead className="border-b">
                  {/* create table row */}
                  <tr>
                    {/* create header cells */}
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">USER</th>
                    <th className="p-5 text-left">DATE</th>
                    <th className="p-5 text-left">TOTAL</th>
                    <th className="p-5 text-left">PAID</th>
                    <th className="p-5 text-left">DELIVERED</th>
                    <th className="p-5 text-left">ACTION</th>
                  </tr>
                </thead>
                {/* create table body */}
                <tbody>
                  {/* use orders.map to convert each order
                      item to a table row*/}
                  {orders.map((order) => (
                    /* set the key equal to order._id */
                    /* table row */
                    <tr key={order._id} className="border-b">
                      {/* first cell  */}
                      <td className="p-5">
                        {order._id.substring(20, 24)}
                        {/* use substring to only show last four characters of the id */}
                      </td>
                      {/* second cell  */}
                      <td className="p-5">
                        {order.user // if order.user does exist
                          ? // render order.user.name
                            order.user.name
                          : // otherwise
                            // render string 'DELETED USER'
                            'DELETED USER'}
                      </td>
                      {/* third cell */}
                      <td className="p-5">
                        {/*show order createdAt only show first 10 characters*/}
                        {order.createdAt.substring(0, 10)}
                      </td>
                      {/* fourth cell */}
                      <td className="p-5">{order.totalPrice} €</td>
                      {/* fifth cell */}
                      <td className="p-5">
                        {order.isPaid
                          ? /*show order paidAt only show first 10 characters*/
                            `${order.paidAt.substring(0, 10)}`
                          : 'not paid'}
                      </td>
                      {/*  sixth cell */}
                      <td className="p-5">
                        {order.isDelivered
                          ? /*show order deliveredAt only show first 10 characters*/
                            `${order.deliveredAt.substring(0, 10)}`
                          : 'not delivered'}
                      </td>
                      {/* seventh cell */}
                      <td className="p-5">
                        <Link href={`/order/${order._id}`} passHref>
                          <a>Details</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// only the authenticated user can access the AdminOrderScreen
// set AdminOrderScreen to authenticate it
AdminOrderScreen.auth = { adminOnly: true };
