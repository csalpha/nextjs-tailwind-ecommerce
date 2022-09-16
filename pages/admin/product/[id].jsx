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

    case 'UPLOAD_REQUEST':
      return {
        ...state, // keep previous state
        loadingUpload: true, // set loadingUpdate to false
        errorUpload: '', // set errorUpdate to empty string
      };
    case 'UPLOAD_SUCCESS':
      return {
        ...state, // keep previous state
        loadingUpload: false, // set loadingUpdate to false
        errorUpload: '', // set errorUpdate to empty string
      };
    case 'UPLOAD_FAIL':
      return {
        ...state, // keep previous state
        loadingUpload: false, // set loadingUpdate to false
        errorUpload: action.payload, // errorUpdate is coming from action.payload
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
  // first: get { loading, error, loadingUpdate, loadingUpload  } from  the reducer hook
  // second: get dispatch from the reducer hook, to dispatch actions
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(
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
          setValue('name', data.name); // set value 'data.name' in input box with id='name'
          setValue('slug', data.slug); // set value 'data.slug' in input box with id='slug'
          setValue('price', data.price); // set value 'data.price' in input box with id='price'
          setValue('image', data.image); // set value 'data.image' in input box with id='image'
          setValue('category', data.category); // set value 'data.category' in input box with id='category'
          setValue('brand', data.brand); // set value 'data.brand' in input box with id='brand'
          setValue('countInStock', data.countInStock); // set value 'data.countInStock' in input box with id='countInStock'
          setValue('description', data.description); // set value 'data.description' in input box with id='description'
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

  // define uploadHandler ( async function )
  const uploadHandler = async (e, imageField = 'image') => {
    // define url
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

    // try catch
    try {
      // dispatch action.type: UPLOAD_REQUEST
      dispatch({ type: 'UPLOAD_REQUEST' });

      //get signature and timestamp from backend using axios('/api/admin/cloudinary-sign')
      const {
        data: { signature, timestamp },
      } = await axios('/api/admin/cloudinary-sign');

      // get file from e.target.files[0]
      const file = e.target.files[0];

      // create a new instance of FormData ( form data is an object)
      const formData = new FormData();

      // append: inserts a set of Node objects or string objects after the last child of the Element
      formData.append(
        'file', // name
        file // value
      );
      formData.append(
        'signature', // name
        signature // value
      );
      formData.append(
        'timestamp', // name
        timestamp // value
      );
      formData.append(
        'api_key', // name
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY // value
      );
      // get data using axios.post
      const { data } = await axios.post(
        url, // pass url
        formData // pass formData
      );
      // dispatch action.type UPLOAD_SUCCESS
      dispatch({ type: 'UPLOAD_SUCCESS' });

      setValue(
        imageField, // 1st param: name
        data.secure_url // 2nd param: value
      );
      // show success message
      toast.success('File uploaded successfully');
      // if there is an error
    } catch (err) {
      dispatch({
        type: 'UPLOAD_FAIL', // dispatch action.type UPLOAD_FAIL
        payload: getError(err), // fill payload with error
      });
      // show error message
      toast.error(getError(err));
    }
  };

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
                <label htmlFor="imageFile">Upload image</label>
                <input
                  type="file"
                  className="w-full"
                  id="imageFile" // connect input to label using htmlFor
                  onChange={uploadHandler}
                />

                {loadingUpload /* loadingUpload is true */ /* AND */ && (
                  /* Show  Uploading.... */
                  <div>Uploading....</div>
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
