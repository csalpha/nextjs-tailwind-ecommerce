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
    // default case
    default:
      // return state as it is
      return state;
  }
}

// export react function conponent AdminProductEditScreen
export default function AdminProductEditScreen() {
  // get query object, from useRouter hook
  const { query } = useRouter();
  // get productId from query.id
  const productId = query.id;

  // define a reducer using useReducer hook
  // first: get { loading, error, loadingUpdate } from  the reducer hook
  // second: get dispatch from the reducer hook, to dispatch actions
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(
    reducer, // first parameter: reducer
    {
      loading: true, // set loading to true
      error: '', // set error to empty string
    } // second parameter: an object
  );

  // get object from useForm
  const {
    register, // register method
    handleSubmit, // handleSubmit method
    formState: { errors },
    setValue, // setValue method
  } = useForm();

  /* define useEffect, because we gonna send
  an ajax request to backend on page load */
  useEffect(
    () => {
      // define fetchData function (async function)
      const fetchData = async () => {
        // define try catch
        try {
          // dispatch FETCH_REQUEST action.type
          dispatch({ type: 'FETCH_REQUEST' });
          /* send an ajax request to backend using axios.get 
        to getting the admin product from backend */
          const { data } = await axios.get(`/api/admin/products/${productId}`);
          // dispatch FETCH_SUCCESS action.type
          dispatch({ type: 'FETCH_SUCCESS' });
          setValue('name', data.name);
          setValue('slug', data.slug);
          setValue('price', data.price);
          setValue('image', data.image);
          setValue('category', data.category);
          setValue('brand', data.brand);
          setValue('countInStock', data.countInStock);
          setValue('description', data.description);
          // if there is an error
        } catch (err) {
          // dispatch FETCH_FAIL action.type
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      // call fetchData
      fetchData();
    }, // first parameter: function with fetchdata inside
    [productId, setValue] // second parameter: array
  );

  // get router from useRouter hook
  const router = useRouter();

  /* define submitHandler (async function)
  that accept an object with product data */
  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }) => {
    // define try catch
    try {
      // dispatch UPDATE_REQUEST action.type
      dispatch({ type: 'UPDATE_REQUEST' });

      // axios.put to update product
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      });
      // dispatch UPDATE_SUCCESS action.type
      dispatch({ type: 'UPDATE_SUCCESS' });
      // show success message
      toast.success('Product updated successfully');
      // redirect user to '/admin/products' address
      router.push('/admin/products');
      // if there is an error
    } catch (err) {
      // dispatch
      dispatch({
        type: 'UPDATE_FAIL', // first parameter
        payload: getError(err), // second parameter
      });
      // show error message
      toast.error(getError(err));
    }
  };
  // render Layout page
  return (
    /* use Layout and define title */
    <Layout title={`Edit Product ${productId}`}>
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
              <Link href="/admin/products">
                <a className="font-bold">Products</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
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
              <h1 className="mb-4 text-xl">{`Edit Product ${productId}`}</h1>
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
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  className="w-full"
                  id="slug" // connect input to label using htmlFor
                  {...register(
                    'slug' /* 1st param */,
                    {
                      required: 'Please enter slug',
                    } /* 2nd param */
                  )}
                />
                {/* check errors.name */}
                {errors.slug /*is true */ /*AND */ && (
                  /* Show alert message */
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  className="w-full"
                  id="price" // connect input to label using htmlFor
                  {...register(
                    'price' /* 1st param */,
                    {
                      required: 'Please enter price',
                    } /* 2nd param */
                  )}
                />
                {/* check errors.price */}
                {errors.price /* is TRUE AND */ && (
                  /* Show error message */
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="image">image</label>
                <input
                  type="text"
                  className="w-full"
                  id="image" // connect input to label using htmlFor
                  {...register('image', {
                    required: 'Please enter image',
                  })}
                />
                {/* check errors */}
                {errors.image /* is TRUE AND */ && (
                  /* Show error message */
                  <div className="text-red-500">{errors.image.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="category">category</label>
                <input
                  type="text"
                  className="w-full"
                  id="category"
                  {...register('category', {
                    required: 'Please enter category',
                  })}
                />
                {/* check errors */}
                {errors.category /* is TRUE AND */ && (
                  /* Show error message */
                  <div className="text-red-500">{errors.category.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="brand">brand</label>
                <input
                  type="text"
                  className="w-full"
                  id="brand"
                  {...register('brand', {
                    required: 'Please enter brand',
                  })}
                />
                {/* check errors */}
                {errors.brand /* is TRUE AND */ && (
                  /* Show error message */
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">countInStock</label>
                <input
                  type="text"
                  className="w-full"
                  id="countInStock"
                  {...register('countInStock', {
                    required: 'Please enter countInStock',
                  })}
                />
                {/* check errors */}
                {errors.countInStock /* is TRUE AND */ && (
                  /* Show error message */
                  <div className="text-red-500">
                    {errors.countInStock.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">description</label>
                <input
                  type="text"
                  className="w-full"
                  id="description"
                  {...register('description', {
                    required: 'Please enter description',
                  })}
                />
                {/* check errors */}
                {errors.description /* is TRUE AND */ && (
                  /* Show error message */
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate /* is true */
                    ? 'Loading'
                    : /* is false */
                      'Update'}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/products`}>Back</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

// only the authenticated user can access the AdminProductEditScreen
// set AdminProductEditScreen to authenticate it
AdminProductEditScreen.auth = { adminOnly: true };
