import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { XCircleIcon } from '@heroicons/react/outline';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
// render the cart page only on client side
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';

function CartScreen() {
  const router = useRouter();

  // access to the context and get cart from it
  const { state, dispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const updateCartHandler = async (
    item,
    qty /* new quantity of the item */
  ) => {
    const quantity = Number(qty); // cast qty to number

    /*when  we put a id in this api, 
      api is be called and the product
      will be returned in a data variable*/
    const { data } = await axios.get(`/api/products/${item._id}`);

    /* check the countInStock in the database to make sure that we have
    stock/quantity in the database */
    if (data.countInStock < quantity) {
      return toast.error('Sorry, this item is temporarily out of stock');
    }
    dispatch(
      {
        type: 'CART_ADD_ITEM', //string
        payload: { ...item, quantity }, // object
      } //object
    );
    toast.success('Product updated in the cart');
  };

  // return a page that shows list of items in the cart
  return (
    /* Create page layout */
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Shopping Cart</h1>
      {cartItems.length === 0 ? ( // true - Cart is empty
        <div>
          Your cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        // false - create a list to show items in the cart
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <a className="flex items-center">
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
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(
                            item,
                            e.target.value /* new quantity of the item */
                          )
                        }
                      >
                        {/* use map function to convert numbers to options for the select box */}
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">€{item.price} €</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : €
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                {/* check authentication of user, 
                if user  logged in -> redirect user to the shipping screen 
                if it's not logged in, keep it in loggin screen */}
                <button
                  onClick={() => router.push('login?redirect=/shipping')}
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
