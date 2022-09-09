import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

/* define reducer that accept two parameters */
function reducer(state, action) {
  // define switch case that accept action.type
  switch (action.type) {
    // case action.type = 'FETCH_REQUEST'
    case 'FETCH_REQUEST':
      return {
        ...state, // keep previous state
        loading: true, // set loading to true
        error: '', // set error to empty string
      };
    // case action.type = 'FETCH_SUCCESS'
    case 'FETCH_SUCCESS':
      return {
        ...state, // keep previous state
        loading: false, // set loading to false
        products: action.payload, // fill the products with data from backend
        error: '', // set error to empty string
      };
    // case action.type = 'FETCH_FAIL'
    case 'FETCH_FAIL':
      return {
        ...state, // // keep previous state
        loading: false, // set loading to false
        error: action.payload, // fill the error with data from backend
      };
    default:
      // return state as it is
      state;
  }
}

// export AdminProdcutsScreen
export default function AdminProdcutsScreen() {
  // array is coming from useReducer
  const [{ loading, error, products }, dispatch] = useReducer(
    reducer, // first parameter: reducer function
    {
      loading: true, // set loading to true
      products: [], // set products to empty array
      error: '', // set error to empty string
    } /* second parameter: is a object */
  );

  /* define useEffect because we are send an ajax request 
  to backend to get data */
  useEffect(
    () => {
      // in the function define fetchData ( async function )
      const fetchData = async () => {
        try {
          // dispatch 'FETCH_REQUEST' action
          dispatch({ type: 'FETCH_REQUEST' });
          // call api on page load using useEffect
          // get data from backend using axios.get
          const { data } = await axios.get(`/api/admin/products`);
          // dispatch 'FETCH_SUCCESS' action
          dispatch({
            type: 'FETCH_SUCCESS', // action.type
            payload: data, // fill payload with data
          });
        } catch (err) {
          //dispatch 'FETCH_FAIL' action
          dispatch({
            type: 'FETCH_FAIL', // action.type
            payload: getError(err) /* set payload with the error message 
          passed to the get error function */,
          });
        }
      };
      // call fetchData
      fetchData();
    }, // first parameter: arrow function
    [] // second parameter: empty array
  );

  // reder Admin Products Layout
  return (
    /* use Layout, set title to Admin Products */
    <Layout title="Admin Products">
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
              <Link href="/admin/orders">Orders</Link>
            </li>
            {/* third li */}
            <li>
              <Link href="/admin/products">
                <a className="font-bold">Products</a>
              </Link>
            </li>
            {/* fourth li */}
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          {/* set heading one to Products 
          set text-extra-large */}
          <h1 className="mb-4 text-xl">Products</h1>
          {/* Condictional rendering */}
          {loading ? ( // if loading does exist
            // show loading div
            <div>Loading...</div>
          ) : // otherwise
          error ? ( // if error does exist
            // show error message
            <div className="alert-error">{error}</div>
          ) : (
            // otherwise
            <div
              className="overflow-x-auto"
              /* table scroll */
            >
              {/* render table */}
              <table className="min-w-full">
                {/* render table head */}
                <thead className="border-b">
                  {/* render table row */}
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">NAME</th>
                    <th className="p-5 text-left">PRICE</th>
                    <th className="p-5 text-left">CATEGORY</th>
                    <th className="p-5 text-left">COUNT</th>
                    <th className="p-5 text-left">RATING</th>
                    <th className="p-5 text-left">ACTIONS</th>
                  </tr>
                </thead>
                {/* render table body */}
                <tbody>
                  {/* use products.map to convert each product to a table row  */}
                  {products.map((product) => (
                    /* table row */
                    <tr key={product._id} className="border-b">
                      <td className=" p-5 ">{product._id.substring(20, 24)}</td>
                      <td className=" p-5 ">{product.name}</td>
                      <td className=" p-5 ">{product.price} €</td>
                      <td className=" p-5 ">{product.category}</td>
                      <td className=" p-5 ">{product.countInStock}</td>
                      <td className=" p-5 ">{product.rating}</td>
                      <td className=" p-5 ">
                        <Link href={`/admin/product/${product._id}`}>Edit</Link>
                        &nbsp;
                        <button>Delete</button>
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

// only the authenticated user can access the AdminProdcutsScreen
// set AdminProdcutsScreen to authenticate it
AdminProdcutsScreen.auth = { adminOnly: true };
