import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
// import  it from react
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
// import it  from '../utils/Store'
import { Store } from '../utils/Store';

// React Functional Component ( rfc + tab)
export default function PlaceOrderScreen() {
  // get the state and dispatch from the context
  const { state, dispatch } = useContext(Store);
  // from the state get the cart
  const { cart } = state;
  // from the cart, get { cartItems, shippingAddress, paymentMethod }
  const { cartItems, shippingAddress, paymentMethod } = cart;
  let tax = 0.0;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  ); // 123.4567 => 123.46

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * tax);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    /* Create a Layout 
    set title to Place Order*/
    <Layout title="Place Order">
      {/* Create CheckoutWizard
      set activeStep to three 
      active one should be Place Order */}
      <CheckoutWizard activeStep={3} />
      {/* Creating Heading One
      set title to Place Order */}
      <h1 className="mb-4 text-xl">Place Order</h1>
      {/* Check cartItems */}
      {cartItems.length === 0 ? ( // if cartItems.length equal to zero
        // it's not possible to checkout
        // render rmpty shopping Cart div
        <div>
          Your Cart is empty. <Link href="/">Continue shopping</Link>
        </div>
      ) : (
        // otherwise
        // render a  div grid medium screen 4 columns set gap to 5
        <div className="grid md:grid-cols-4 md:gap-5">
          {/* Create a div a column - occupy three of four columns
          span 3 of 4 columns */}
          {/* First Column - display Shipping Address, Payment Method, Order Items */}
          <div className="overflow-x-auto md:col-span-3">
            {/* Create a card, set padding 5 */}
            <div className="card  p-5">
              {/* inside the card render h2 (Shipping Address) */}
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              {/* render div  with shippingAddress properties */}
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </div>
              <div>
                {/* Create a Link to the shipping address page*/}
                <Link href="/shipping">Edit</Link>
              </div>
            </div>
            {/* Create a card, set padding 5 */}
            <div className="card  p-5">
              {/* inside the card render h2 (Payment Method) */}
              <h2 className="mb-2 text-lg">Payment Method</h2>
              {/* Display the paymentMethod */}
              <div>{paymentMethod}</div>
              <div>
                {/* Create a Link to edit the selected Payment Method */}
                <Link href="/payment">Edit</Link>
              </div>
            </div>
            {/* Create a card, set padding 5 */}
            <div className="card overflow-x-auto p-5">
              {/* set header to Order Items */}
              <h2 className="mb-2 text-lg">Order Items</h2>
              {/* Create a table */}
              <table className="min-w-full">
                {/* Create a table head */}
                <thead className="border-b">
                  {/* 1st row */}
                  <tr>
                    {/* 4 columns
                     */}
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                {/* Create a table body */}
                <tbody>
                  {/* render cartItems 
                  map each item in the cart to a table row*/}
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      {/* first cell - item image and item name */}
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>{' '}
                            {/* item image */}
                            &nbsp;
                            {item.name} {/* item name */}
                          </a>
                        </Link>
                      </td>
                      {/* second cell - item.quantity */}
                      <td className=" p-5 text-right">{item.quantity}</td>
                      {/* third cell - item.price */}
                      <td className="p-5 text-right">{item.price} €</td>
                      {/* fourth cell - Subtotal */}
                      <td className="p-5 text-right">
                        {item.quantity * item.price} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                {/* Create a Link to redirect user to the cart screen
                to edit the shopping cart */}
                <Link href="/cart">Edit</Link>
              </div>
            </div>
          </div>
          {/* Second column - action column in the palce order */}
          <div>
            {/* Create a card, set padding 5 */}
            <div className="card  p-5">
              {/* set header to Order Summary */}
              <h2 className="mb-2 text-lg">Order Summary</h2>
              {/* Create a ul */}
              <ul>
                {/* first <li> is for items price */}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>{itemsPrice} €</div>
                  </div>
                </li>
                {/* Second <li> is for tax price */}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>{taxPrice} €</div>
                  </div>
                </li>
                {/* Third <li> is for shipping price */}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>{shippingPrice} €</div>
                  </div>
                </li>
                {/* Fourth <li> is for total price */}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>{totalPrice} €</div>
                  </div>
                </li>
                {/* Fifth <li> is for placeOrderHandler button */}
                <li>
                  <button
                    // if i'm loading make it disabled
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full" // full width
                  >
                    {loading // if i'm loading
                      ? // display 'Loading...' in the button name
                        'Loading...' // else
                      : // display 'Place Order' in the button name
                        'Place Order'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
/* make PlaceOrderScreen authenticated 
only authenticated user can have access to this page*/
PlaceOrderScreen.auth = true;
