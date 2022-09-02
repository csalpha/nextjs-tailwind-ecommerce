import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

// define reducer function
function reducer(state, action) {
  // check action.type
  switch (action.type) {
    // case action.type is 'FETCH_REQUEST'
    /* it means that we send a ajax request to backend 
    and we want to show a loading message and no error */
    case 'FETCH_REQUEST':
      return {
        ...state, // keep previous state
        loading: true, // change loading to true
        error: '', // change error to empty
      };
    // case action.type is 'FETCH_SUCCESS'
    /* happens after getting data from backend */
    case 'FETCH_SUCCESS':
      return {
        ...state, // keep previous state
        loading: false, // change loading to false
        order: action.payload, // order is coming from the action.payload
        error: '', // there is no error
      }; // error is empty
    // case action.type is 'FETCH_FAIL'
    // Error state
    case 'FETCH_FAIL':
      return {
        ...state, // keep previous state
        loading: false, // change loading to false
        error: action.payload, // error is coming from the action.payload
      };
    // default case
    default:
      // return state as it is
      state;
  }
}

// create OrderScreen function
function OrderScreen() {
  // OrderScreen implement
  // order/:id
  // get query from useRouter hook
  const { query } = useRouter();
  // get the orderId from query.id
  const orderId = query.id;

  // define a reducer using useReducer hook
  // first: get { loading, error, order } from  the reducer hook
  // second: get dispatch from the reducer hook, to dispatch actions
  const [{ loading, error, order }, dispatch] = useReducer(
    reducer, // first parameter: reducer function
    {
      loading: true, // set loading to true
      order: {}, // set the order to empty object
      error: '', // set the error to empty string
    } // second parameter is default value
  );
  /* define useEffect, because we gonna send
  an ajax request to backend on page load */

  useEffect(() => {
    // define fetchOrder function (async function)
    const fetchOrder = async () => {
      try {
        // dispatch FETCH_REQUEST
        dispatch({ type: 'FETCH_REQUEST' });
        /* send an ajax request to backend using axios.get 
           to getting the order from backend */
        const { data } = await axios.get(`/api/orders/${orderId}`);
        // dispatch FETCH_SUCCESS
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data, // pass data of the order as a payload
        });
      } catch (err) {
        // if there is an error
        dispatch({
          type: 'FETCH_FAIL', // dispatch FETCH_FAIL
          payload: getError(err) /* payload is getError 
          pass err to get the correct error message
          from the error object */,
        });
      }
    };
    // condiction for calling fetchOrder function
    if (
      !order._id || // if order._id does not exist or
      (order._id && order._id !== orderId) /* if order._id does exists but
      order._id does not equal to orderId in the url, it means that we have 
       order but it's about previously visited order id */
    ) {
      /* call fetchOrder function to fetch order for 
       the new order in the url */
      fetchOrder();
    }
  }, [
    order,
    orderId,
  ]); /* if there is a change in the order or orderId, useEffect 
  runs again */

  // get shipping information from the order
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  return (
    // create Layout, with title
    <Layout title={`Order ${orderId}`}>
      {/* UI part inside the Layout */}
      {/* Show heading one 
      magin-bottom-4 and text-extra-large */}
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? ( // if we loading data
        // show loading message
        <div>Loading...</div>
      ) : //otherwise if there is an error
      error ? (
        // show error message ( alert error )
        <div className="alert-error">{error}</div>
      ) : (
        /* otherwise: show order information */
        /* create a grid for medium device | it has 4 columns |
        gap between cols are 5 */
        <div className="grid md:grid-cols-4 md:gap-5">
          {/* first column */}
          <div className="overflow-x-auto md:col-span-3">
            {/* first card: Shipping Address*/}
            <div className="card  p-5">
              {/* title card: Shipping Address */}
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {/* show shipping information */}
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </div>
              {/* check the delivery status */}
              {isDelivered ? ( // if isDelivered is true
                /* show alert-success  */
                <div className="alert-success">Delivered at {deliveredAt}</div>
              ) : (
                // otherwise
                /* show error message */
                <div className="alert-error">Not delivered</div>
              )}
            </div>
            {/* second card: Payment Method */}
            {/* card padding-5 */}
            <div className="card p-5">
              {/* title card: Payment Method */}
              <h2 className="mb-2 text-lg">Payment Method</h2>
              {/* Show the payment method */}
              <div>{paymentMethod}</div>
              {/* check isPaid  */}
              {isPaid ? ( // if it's true
                /* show success full box */
                <div className="alert-success">Paid at {paidAt}</div>
              ) : (
                // otherwise
                // in error box show not paid
                <div className="alert-error">Not paid</div>
              )}
            </div>
            {/* create third card: Order Items */}
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              {/* create a table */}
              <table className="min-w-full">
                {/* create table head */}
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                {/* create table body */}
                {/* show order information */}
                <tbody>
                  {/* use orderItems.map to convert each order
                      item to a table row*/}
                  {orderItems.map(
                    (item /* create a table row with border-bottom*/) => (
                      <tr key={item._id} className="border-b">
                        {/* create the first cell */}
                        <td>
                          {/* create a link */}
                          <Link href={`/product/${item.slug}`}>
                            <a className="flex items-center">
                              {/* use image from 'next/image' */}
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                              ></Image>
                              &nbsp;
                              {item.name}
                            </a>
                          </Link>
                        </td>
                        {/* Show the item information */}
                        <td className=" p-5 text-right">{item.quantity}</td>
                        <td className="p-5 text-right">${item.price}</td>
                        <td className="p-5 text-right">
                          ${item.quantity * item.price}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* second column */}
          <div>
            {/* first card: Order Summary */}
            <div className="card  p-5">
              {/* Create heading-2
              make text large
              title is Order Summary */}
              <h2 className="mb-2 text-lg">Order Summary</h2>
              {/* create a ul */}
              <ul>
                {/* first li: items price */}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>{' '}
                {/* second li: tax price */}
                <li>
                  {/*  flex justify-between to 
                  put the label in the left side
                  and the value in the right side */}
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                {/* third li: shippingPrice */}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                {/* fourth li: totalPrice */}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

/* make OrderScreen authenticated,
   only authenticated user can have access to this page */
OrderScreen.auth = true;
// export OrderScreen
export default OrderScreen;
