import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
// import CheckoutWizard from CheckoutWizard.jsx
import CheckoutWizard from '../components/CheckoutWizard';
// import Layout from Layout.jsx
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

// implemented creating payment method screen to get the payment method from the user
export default function PaymentScreen() {
  /* get selectedPaymentMethod and setSelectedPaymentMethod function 
  from state hook and set selectedPaymentMethod value to empty string */
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  // use useContext to access to the state
  const { state, dispatch } = useContext(Store);
  // get cart from the state
  const { cart } = state;
  // get shippingAddress and paymentMethod from the cart
  const { shippingAddress, paymentMethod } = cart;
  // get router from useRouter
  const router = useRouter();

  // implement submitHandler function
  const submitHandler = (e) => {
    // not refresh the page when user click on next
    e.preventDefault();
    // check the selectedPaymentMethod
    if (!selectedPaymentMethod) {
      // if it is not selected then
      // show error message
      return toast.error('Payment method is required');
    }
    /* if selectedPaymentMethod is selected 
    dispatch this action 'SAVE_PAYMENT_METHOD' */
    dispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: selectedPaymentMethod,
    });
    // save the selectedPaymentMethod in the cookies
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    // redirect user to the placeorder screen
    router.push('/placeorder');
  };
  // defining useEffect
  useEffect(() => {
    // check for shippingAddress.address
    // if it doesn't exist
    if (!shippingAddress.address) {
      // redirect user to the shipping address
      return router.push('/shipping');
    }
    /* otherwise  setSelectedPaymentMethod to the paymentMethod 
    in the react context */
    setSelectedPaymentMethod(paymentMethod || '');
    /* all variables in the useEffect function 
    inside the dependecy array */
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    /* return Layout */
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} /> {/* set activeStep to two */}
      {/* creat a from */}
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        {/* creating heading one */}
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {/* define array with payment ways */}
        {/* use the map function to convert each payment method to a div */}
        {['PayPal', 'Stripe', 'CashOnDelivery'].map((payment) => (
          /* set the key to the payment to make it unique */
          /* set margin-bottom-4 */
          <div key={payment} className="mb-4">
            {/* Create a radio box */}
            <input
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={payment} // set id to the payment
              type="radio" // set type to radio
              /* compared the selectedPaymentMethod with the payment with 
              in the array items */
              checked={selectedPaymentMethod === payment}
              /* upadte the selected payment using setSelectedPaymentMethod */
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            {/* create a label and connect the label
             to this input box, using htmlFor  */}
            {/* when you click on the label the relevant 
              input box will be selected automatically*/}
            <label className="p-2" htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}
        {/* create a div with two button in the right
        and left side */}
        <div className="mb-4 flex justify-between">
          {/* create Back Button */}
          <button
            /* redirect to previous window (ShippingScreen) */
            onClick={() => router.push('/shipping')}
            type="button"
            className="default-button"
          >
            Back
          </button>
          {/* create Next Button */}
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}
