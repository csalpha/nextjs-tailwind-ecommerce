import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

/* define reducer that accept two parameters */
function reducer(
  state, // 1st parameter
  action // 2nd parameter
) {
  /* define switch case that accept action.type */
  switch (action.type) {
    // case action.type = 'FETCH_REQUEST'
    case 'FETCH_REQUEST':
      return {
        ...state, // keep previous state
        loading: true, // set loading to true
        error: '', // error to empty string
      };
    // case action.type = 'FETCH_SUCCESS'
    case 'FETCH_SUCCESS':
      return {
        ...state, // keep previous state
        loading: false, // set loading to false
        users: action.payload, // fill users with action.payload
        error: '', // error to empty string
      };
    // case action.type = 'FETCH_FAIL'
    case 'FETCH_FAIL':
      return {
        ...state, // keep previous state
        loading: false, // set loading to false
        error: action.payload, // fill error with action.payload
      };
    // case action.type = 'DELETE_REQUEST'
    case 'DELETE_REQUEST':
      return {
        ...state, // keep previous state
        loadingDelete: true, // set loading to true
      };
    // case action.type = 'DELETE_SUCCESS'
    case 'DELETE_SUCCESS':
      return {
        ...state, // keep previous state
        loadingDelete: false, // set loadingDelete to false
        successDelete: true, // set successDelete to true
      };
    // case action.type = 'DELETE_FAIL'
    case 'DELETE_FAIL':
      return {
        ...state, // keep previous state
        loadingDelete: false, // set loadingDelete to false
      };
    // case action.type = 'DELETE_RESET'
    case 'DELETE_RESET':
      return {
        ...state, // keep previous state
        loadingDelete: false, // set loadingDelete to false
        successDelete: false, // set successDelete to false
      };
    default:
      // return state as it is
      return state;
  }
}

// define functional component
function AdminUsersScreen() {
  // is coming from useReducer
  const [
    { loading, error, users, successDelete, loadingDelete } /* [0]  */,
    dispatch /* [1] */,
  ] = useReducer(
    reducer, // first parameter: reducer function
    {
      loading: true /* set loading to true */,
      users: [] /* empty array */,
      error: '' /* empty string */,
    } /* second parameter: object */
  );

  /* define useEffect because we are send an ajax request 
  to backend to get data */
  useEffect(
    () => {
      // in the function define fetchData ( async function )
      const fetchData = async () => {
        // define try catch
        try {
          dispatch({
            type: 'FETCH_REQUEST', // action.type = 'FETCH_REQUEST'
          });
          // get data from backend using axios.get (request)
          const { data } = await axios.get(`/api/admin/users`);
          dispatch({
            type: 'FETCH_SUCCESS', // action.type = 'FETCH_SUCCESS'
            payload: data, // fill payload with data
          });
        } catch (err) {
          /* if there is an error */
          dispatch({
            type: 'FETCH_FAIL', // action.type = 'FETCH_FAIL'
            payload: getError(err), // fill payload with error
          });
        }
      };
      if (successDelete) {
        // if successDelete is defined
        dispatch({
          type: 'DELETE_RESET', // action.type = 'DELETE_RESET'
        });
      } else {
        // call function
        fetchData();
      }
    } /* 1st parameter: arrow function  */,
    [successDelete]
  );

  /* define deleteHandler (async function)
       paramter: userId */
  const deleteHandler = async (userId) => {
    if (
      !window.confirm(
        'Are you sure?' // parameter is a string
      )
    ) {
      // exit
      return;
    }
    // define try catch
    try {
      dispatch({
        type: 'DELETE_REQUEST', // action.type = 'FETCH_REQUEST'
      });
      /* delete data from backend using axios.delete */
      await axios.delete(
        `/api/admin/users/${userId}` //parameter
      );

      dispatch({
        type: 'DELETE_SUCCESS', // action.type = 'FETCH_REQUEST'
      });
      // show success message
      toast.success('User deleted successfully');
    } catch (err) {
      // if there is an error
      dispatch({
        type: 'DELETE_FAIL', // action.type = 'FETCH_REQUEST'
      });
      // show error message
      toast.error(getError(err));
    }
  };

  // reder Admin Products Layout
  return (
    /* use Layout, set title to Users */
    <Layout title="Users">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          {/* create ul */}
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products">Products</Link>
            </li>
            <li>
              <Link href="/admin/users">
                <a className="font-bold">Users</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          {/* set heading one to Users 
               set margin-bottom-4 
               text-extra-large    */}
          <h1 className="mb-4 text-xl">Users</h1>
          {/* check loadingDelete */}
          {loadingDelete /* loadingDelete is defined */ /* AND */ && (
            /* render div with text: 'Deleting...' */
            <div>Deleting...</div>
          )}
          {/* check loading */}
          {loading /* loadin is defined */ ? (
            /* render div with text: 'Loading...' */
            <div>Loading...</div>
          ) : // otherwise
          error ? ( // error is defined
            /* render alert error */
            <div className="alert-error">{error}</div>
          ) : (
            // otherwise
            /* render table */
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">NAME</th>
                    <th className="p-5 text-left">EMAIL</th>
                    <th className="p-5 text-left">ADMIN</th>
                    <th className="p-5 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className=" p-5 ">{user._id.substring(20, 24)}</td>
                      <td className=" p-5 ">{user.name}</td>
                      <td className=" p-5 ">{user.email}</td>
                      <td className=" p-5 ">{user.isAdmin ? 'YES' : 'NO'}</td>
                      <td className=" p-5 ">
                        <Link href={`/admin/user/${user._id}`} passHref>
                          <a type="button" className="default-button">
                            Edit
                          </a>
                        </Link>
                        &nbsp;
                        <button
                          type="button"
                          className="default-button"
                          onClick={() => deleteHandler(user._id)}
                        >
                          Delete
                        </button>
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

/* only the authenticated user can access the AdminUsersScreen
 set AdminUsersScreen to authenticate it */
AdminUsersScreen.auth = { adminOnly: true };

// export componente
export default AdminUsersScreen;
