// useContext is coming from react
import React, { useContext, useEffect } from 'react';
// useForm is coming from react-hook-form
import { useForm } from 'react-hook-form';
// Cookies is coming from js-cookie
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
// Store is coming from utils
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';

export default function ShippingScreen() {
  // handleSubmit is comming from useForm()
  const {
    handleSubmit, // get handleSubmit from useForm()
    register, // get register from ...
    formState: { errors },
    setValue,
  } = useForm();

  // object is coming from useContext, ist's accepts Store from utils
  const { state, dispatch } = useContext(Store); // Update the data in the Context
  // get the cart from state
  const { cart } = state;
  // get the shippingAddress from cart
  const { shippingAddress } = cart;
  // get router from useRouter()
  const router = useRouter();

  /*fill the input boxes based on the data in the 
  shipping address in the context*/
  useEffect(() => {
    /* fill the input boxes based on the data in the react context */
    /* set the fullName input box with the 
    full name in the shipping address field 
    do the same for address, city, postalCode, country */
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  // define submitHandler function
  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    //
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS', // dispatch SAVE_SHIPPING_ADDRESS action
      // dispatch a object with shipping fields (payload)
      payload: { fullName, address, city, postalCode, country },
    });

    // Save data in the cookies
    Cookies.set(
      'cart', // key
      JSON.stringify({
        ...cart, // keep previous data in the cart
        // update shippingAddress
        shippingAddress: {
          fullName, // get full mame
          address,
          city,
          postalCode,
          country,
        },
      })
    );

    // redirect user to the payment screen
    router.push('/payment');
  };

  return (
    /* create layout */
    <Layout title="Shipping Address">
      *{/* create CheckoutWizard */}
      {/* set active step to 1 */}
      <CheckoutWizard activeStep={1} />
      {/* create a form */}
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        {/* div with margin-bottom-4 */}
        <div className="mb-4">
          {/* define fullName label  */}
          <label htmlFor="fullName">Full Name</label>
          {/* input to get Full Name */}
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register(
              'fullName', // register fullName
              { required: 'Please enter full name' } // Full Name is required
            )}
          />
          {/* if errors.fullname does exist, show errors.fullName.message */}
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        {/* div with margin-bottom-4 */}
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          {/* input to get Address */}
          <input
            className="w-full"
            id="address"
            {...register(
              'address', // register address
              // validation options
              {
                required: 'Please enter address', // address is required
                minLength: {
                  value: 3, // min length value
                  // if less than 3, show message
                  message: 'Address is more than 2 chars',
                },
              }
            )}
          />
          {/* if errors.address does exist, show errors.address.message */}
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        {/* div with margin-bottom-4 */}
        <div className="mb-4">
          <label htmlFor="city">City</label>
          {/* input to get City */}
          <input
            className="w-full"
            id="city"
            {...register(
              'city', // register city
              {
                required: 'Please enter city', // City is required
              }
            )}
          />
          {/* if errors.city does exist, show errors.city.message */}
          {errors.city && (
            <div className="text-red-500 ">{errors.city.message}</div>
          )}
        </div>
        {/* div with margin-bottom-4 */}
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          {/* input to get Postal Code */}
          <input
            className="w-full"
            id="postalCode"
            {...register(
              'postalCode', // Register Postal Code
              {
                required: 'Please enter postal code', // Postal Code is required
              }
            )}
          />
          {/* if errors.postalCode does exist, show errors.postalCode.message */}
          {errors.postalCode && (
            <div className="text-red-500 ">{errors.postalCode.message}</div>
          )}
        </div>
        {/* div with margin-bottom-4 */}
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          {/* input to get Country */}
          <input
            className="w-full"
            id="country"
            {...register(
              'country', // Register Country
              {
                required: 'Please enter country', // Country is required
              }
            )}
          />
          {/* if errors.country does exist, show errors.country.message */}
          {errors.country && (
            <div className="text-red-500 ">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

// only logged in user can access to ShippingScreen
ShippingScreen.auth = true; // set ShippingScreen.auth to true
