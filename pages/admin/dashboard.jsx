import axios from 'axios';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// export options
export const options = {
  responsive: true, // set responsive to true
  plugins: {
    legend: {
      position: 'top', // set position to top
    },
  },
};

/* define reducer that accept two parameters */
function reducer(state /* first parameter */, action /* second parameter */) {
  // define switch case
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

//create dashboard screen
function AdminDashboardScreen() {
  // array is coming from useReducer
  const [
    {
      loading,
      error,
      summary,
    } /* object that contains loading, error, summary  */,
    dispatch,
  ] =
    /* array */
    useReducer(
      reducer, // first parameter: reducer function
      {
        loading: true, // set loading to true
        summary: { salesData: [] },
        error: '', // set error to empty string
      } /* second parameter: is a object */
    );

  /* define useEffect because we are send an ajax request 
  to backend to get data */
  useEffect(
    () => {
      // in the function define fetchData ( async function )
      const fetchData = async () => {
        // define trycatch
        try {
          // dispatch 'FETCH_REQUEST' action
          dispatch({ type: 'FETCH_REQUEST' });
          // call api on page load using useEffect
          const { data } = await axios.get(`/api/admin/summary`);
          /* dispatch 'FETCH_SUCCESS' action and pass the data from backend 
             as payload to fetch success action */
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
          //if there is an error
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL', //dispatch 'FETCH_FAIL' action
            payload: getError(err) /* payload is the error message 
            passed to the get error function */,
          });
        }
      };

      // call fetchData  ( async function )
      fetchData();
    }, // first parameter: arrow function
    [] // second parameter: empty array
  );
  // de
  const data = {
    labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(162, 222, 208, 1)',
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };

  return (
    /* use Layout, set title to Admin Dashboard */
    <Layout title="Admin Dashboard">
      <div className="grid  md:grid-cols-4 md:gap-5">
        <div>
          {/* create ul */}
          <ul>
            {/* first li */}
            <li>
              <Link href="/admin/dashboard">
                <a className="font-bold">Dashboard</a>
              </Link>
            </li>
            {/* second li */}
            <li>
              <Link href="/admin/orders">Orders</Link>
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
        <div className="md:col-span-3">
          {/* set heading one to Admin Dashboard 
          set text-extra-large */}
          <h1 className="mb-4 text-xl">Admin Dashboard</h1>
          {/* Condictional rendering */}
          {loading ? ( // if loading does exist
            // show loading div
            <div>Loading...</div>
          ) : error ? ( // if error does exist
            // show error message
            <div className="alert-error">{error}</div>
          ) : (
            // otherwise
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="card m-5 p-5">
                  <p className="text-3xl">{summary.ordersPrice} €</p>
                  <p>Sales</p>
                  <Link href="/admin/orders">View sales</Link>
                </div>
                <div className="card m-5 p-5">
                  <p className="text-3xl">{summary.ordersCount} </p>
                  <p>Orders</p>
                  <Link href="/admin/orders">View orders</Link>
                </div>
                <div className="card m-5 p-5">
                  <p className="text-3xl">{summary.productsCount} </p>
                  <p>Products</p>
                  <Link href="/admin/products">View products</Link>
                </div>
                <div className="card m-5 p-5">
                  <p className="text-3xl">{summary.usersCount} </p>
                  <p>Users</p>
                  <Link href="/admin/users">View users</Link>
                </div>
              </div>
              {/* set heading two Sales Report
               set text-extra-large */}
              <h2 className="text-xl">Sales Report</h2>
              {/* define Bar Chart */}
              <Bar
                // set options
                options={{
                  legend: { display: true, position: 'right' },
                }}
                // set data
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// only the authenticated user can access the AdminDashboardScreen
// set AdminDashboardScreen to authenticate it
AdminDashboardScreen.auth = { adminOnly: true };

// export AdminDashboardScreen
export default AdminDashboardScreen;
