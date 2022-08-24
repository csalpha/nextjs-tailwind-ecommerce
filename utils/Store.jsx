import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

// call createContext()
export const Store = createContext();

// define initial state
const initialState = {
  // read the cart object from the cookie
  cart: Cookies.get('cart') // true or false
    ? JSON.parse(Cookies.get('cart')) // convert the cart in the cookie to js object
    : {
        cartItems: [], // set the cartItems with empty array
        shippingAddress: {}, // set the shippingAddress with empty object
      },
};

// define reducer function
function reducer(state, action) {
  // check action.type
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      //update state and add new item

      // get newItem from the payload of that action
      const newItem = action.payload;

      // search the state for this item
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );

      /* 
      otherwise simply using the constructing array operator 
      to decontruct all items in the cart and concatenate them 
      with the new item */

      // if cartItems are equal to existItem
      const cartItems = existItem
        ? //check each item in the cartItems
          state.cart.cartItems.map((item) =>
            //if they are equal to existItem replace with newItem
            item.name === existItem.name
              ? //newItem contains the new quantity of this item on the cart
                newItem
              : // keep the items in the cart items as they are
                item
          )
        : /* using the constructing array operator 
        to decontruct all items in the cart and 
        concatenate them with the new item */
          [...state.cart.cartItems, newItem]; // we push the new item at the end of the cart items

      // save cart in the cookie
      Cookies.set(
        'cart',
        JSON.stringify({ ...state.cart, cartItems }) // convert to string
      );

      // return updated cart items
      return {
        ...state, // keep the previous state
        cart: {
          ...state.cart, // keep the previous values in the cart
          cartItems, // update the cartItems
        }, // update the cart
      };
    }
    case 'CART_REMOVE_ITEM': {
      // define cartItems
      // filter cartItems based on the slug
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );

      // save cart in the cookie
      Cookies.set(
        'cart',
        JSON.stringify({ ...state.cart, cartItems }) // convert to string
      );

      /* return all card items except that we passed in the
      action.payload */
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    // implement CART_RESET action
    case 'CART_RESET':
      return {
        ...state, // keep the previous state
        // make cart a empty object
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };
    // case of SAVE_SHIPPING_ADDRESS in the rducer
    case 'SAVE_SHIPPING_ADDRESS':
      // return object
      return {
        ...state, // keep the fields of state as they are
        cart: {
          ...state.cart, // keep the fields of cart as they are
          shippingAddress: {
            ...state.cart.shippingAddress, // keep the previous data in the shipping address
            ...action.payload, //update shippingAddress fields by the data in the payload
            /* is comming from the shipping form, the data that user entered in 
            the input boxes */
          },
        },
      };
    default:
      return state; // return state as they are
  }
}

// define a react component
export function StoreProvider({ children }) {
  // get the state and dispatch from useReducer
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}
