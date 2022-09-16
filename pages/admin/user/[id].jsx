import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';

/* define reducer that accept two parameters */
function reducer(state, action) {
  // define switch case that accept action.type
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
        error: '', // set error to empty string
      };
    /* case action.type is 'FETCH_FAIL' */
    case 'FETCH_FAIL':
      return {
        ...state, // keep previous state
        loading: false, // set loading to false
        error: action.payload, // error is coming from action.payload
      };
    /* case action.type is 'UPDATE_REQUEST' */
    case 'UPDATE_REQUEST':
      return {
        ...state, // keep previous state
        loadingUpdate: true, // set loadingUpdate to true
        errorUpdate: '', // set errorUpdate to empty string
      };
    case 'UPDATE_SUCCESS':
      return {
        ...state, // keep previous state
        loadingUpdate: false, // set loadingUpdate to false
        errorUpdate: '', // set errorUpdate to empty string
      };
    case 'UPDATE_FAIL':
      return {
        ...state, // keep previous state
        loadingUpdate: false, // set loadingUpdate to false
        errorUpdate: action.payload, // errorUpdate is coming from action.payload
      };
    // default case
    default:
      // return state as it is
      return state;
  }
}

// export react function conponent AdminUserEditScreen
export default function AdminUserEditScreen() {
  // get query object, from useRouter hook
  const { query } = useRouter();
  // get userId from query.id
  const userId = query.id;

  /* define a reducer using useReducer hook 
  first: get { loading, error, loadingUpdate, loadingUpload  } from  the reducer hook
  second: get dispatch from the reducer hook, to dispatch actions */
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(
    /* first parameter: reducer */
    reducer,
    {
      loading: true /* set loading to true */,
      error: '' /* set error to empty string */,
    } /* second parameter: an object */
  );

  /* get object from useForm */
  const {
    register /* register method */,
    handleSubmit /* handleSubmit method } = useForm(); */,
    formState: { errors },
    setValue, // setValue method */
  } = useForm();

  /* define useEffect, because we gonna send
  an ajax request to backend on page load */
  useEffect(
    () => {
      /* define fetchData function (async function) */
      const fetchData = async () => {
        /*define try catch */
        try {
          // dispatch FETCH_REQUEST action.type
          dispatch({ type: 'FETCH_REQUEST' });
          /* send an ajax request to backend using axios.get 
        to getting the admin product from backend */
          const { data } = await axios.get(`/api/admin/users/${userId}`);
          /* dispatch FETCH_SUCCESS action.type */
          dispatch({ type: 'FETCH_SUCCESS' });
          setValue('name', data.name);
          setValue('email', data.email);
          setValue('isAdmin', data.isAdmin);
          setValue('isSeller', data.isSeller);
        } catch (err) {
          // dispatch FETCH_FAIL action.type
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      // call fetchData
      fetchData();
    }, // first parameter: function with fetchdata inside
    [userId, setValue] // second parameter: array
  );

  // get router from useRouter hook
  const router = useRouter();

  /* define submitHandler (async function)
  that accept an object with user data */
  const submitHandler = async ({ name, email, isAdmin, isSeller }) => {
    /* define try catch */
    try {
      /* dispatch UPDATE_REQUEST action.type */
      dispatch({ type: 'UPDATE_REQUEST' });
      /* axios.put to update product */
      await axios.put(`/api/admin/users/${userId}`, {
        name,
        email,
        isAdmin,
        isSeller,
      });
      /* dispatch UPDATE_SUCCESS action.type */
      dispatch({ type: 'UPDATE_SUCCESS' });
      /* show success message */
      toast.success('User updated successfully');
      /* redirect user to '/admin/users' address */
      router.push('/admin/users');
      /* if there is an error */
    } catch (err) {
      /* dispatch */
      dispatch({
        type: 'UPDATE_FAIL' /* first parameter */,
        payload: getError(err) /* second parameter */,
      });
      // show error message
      toast.error(getError(err));
    }
  };
  // render Layout page
  return (
    <Layout title={`Edit User ${userId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          {/* create ul */}
          <ul>
            {/* create first li */}
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

        <div className="md:col-span-3">
          {/* check loading */}
          {loading ? ( // loading does exist
            // sow Loading... message
            <div>Loading...</div> // otherwise
          ) : error ? ( // error does exist
            // show error
            <div className="alert-error">{error}</div>
          ) : (
            // otherwise
            // show form
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit User ${userId}`}</h1>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="w-full"
                  id="name" // connect input to label using htmlFor
                  autoFocus
                  {...register(
                    'name' /* first parameter */,
                    {
                      required: 'Please enter name',
                    } /* second parameter is a object */
                  )}
                />
                {/* check errors.name */}
                {errors.name && ( // if is true AND
                  /* show alert error message */
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>
              <div className="mb-4">
                {/* create a label and connect the label
             to this input box, using htmlFor  */}
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="w-full"
                  id="email" // connect input to label
                  {...register(
                    'email' /* first parameter */,
                    {
                      required: 'Please enter email',
                    } /* second parameter is a object */
                  )}
                />
                {/* check errors.email */}
                {errors.email && ( // if is true AND
                  /* show alert error message */
                  <div className="text-red-500">{errors.email.message}</div>
                )}
              </div>

              <div className="mb-4">
                <input
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  type="checkbox"
                  id="isAdmin"
                  {...register(
                    'isAdmin' /* first parameter */,
                    {} /* second parameter is a object */
                  )}
                />
                <label className="ml-2" htmlFor="isAdmin">
                  isAdmin
                </label>
              </div>
              <div className="mb-4">
                <input
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  type="checkbox"
                  id="isSeller"
                  {...register(
                    'isSeller' /* first parameter */,
                    {} /* second parameter is a object */
                  )}
                />
                <label className="ml-2" htmlFor="isSeller">
                  isSeller
                </label>
              </div>

              <div className="mb-4"></div>
              {/* button box with margin-bottom-four */}
              <div className="mb-4">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate /* is true */
                    ? 'Loading'
                    : /* is false */
                      'Update'}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/users`}>Back</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminUserEditScreen.auth = { adminOnly: true };
