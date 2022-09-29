import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

/* we wanna use react context to save the cart items in a global state
   and use it in Components */

/* Create and export Context ( Store )  */
export const Store = createContext();

/* define initial state */
const initialState = {
  // read the cart object from the cookie
  cart: Cookies.get(
    'cart' // pass 'cart'
  ) // if it's true
    ? // convert the cart in the cookie to js object
      JSON.parse(
        Cookies.get(
          'cart' // pass parameter
        ) // pass parameter
      ) // otherwise
    : {
        cartItems: [], // set the cartItems with empty array
        shippingAddress: {}, // set the shippingAddress with empty object
        paymentMethod: '', // set the paymentMethod with a empty string
      },

  /* user info */
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
};

/* define reducer that accept two parameters */
function reducer(
  state, // 1st parameter
  action // 2nd parameter
) {
  /* define switch case that accept one parameter
  and check action.type */
  switch (
    action.type // pass parameter
  ) {
    /* case action.type is 'CART_ADD_ITEM' */
    case 'CART_ADD_ITEM': {
      //update state and add new item

      /* get newItem from action.payload */
      const newItem = action.payload;

      // search the state for this item
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug // pass param
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
              : // otherwise
                // keep the items in the cart items as they are
                item
          )
        : /* using the constructing array operator 
        to decontruct all items in the cart and 
        concatenate them with the new item */
          [
            ...state.cart.cartItems, // [0] - keep all values
            newItem, //
          ]; // we push the new item at the end of the cart items

      // save cart in the cookie
      Cookies.set(
        'cart', // 1st param
        JSON.stringify({
          ...state.cart, // keep values
          cartItems, // pass cartItems
        }) // 2nd param
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
    /* case action.type is 'CART_REMOVE_ITEM' */
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

      /* return all cart items except that we passed in the
      action.payload */
      return {
        ...state, // keep previous state
        cart: {
          ...state.cart, // keep previous state
          cartItems, // update cartItems
        },
      };
    }
    /* case action.type is 'CART_RESET' */
    case 'CART_RESET':
      // implement CART_RESET action
      return {
        ...state, // keep the previous state
        // make cart a empty object
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };
    /* case action.type is 'CART_CLEAR_ITEMS' */
    case 'CART_CLEAR_ITEMS':
      // implement CART_CLEAR_ITEMS
      return {
        ...state, // keep the previous state
        cart: {
          ...state.cart, // keep the cart
          cartItems: [], // set cartItems to empty array
        },
      };
    // case SAVE_SHIPPING_ADDRESS in the rducer
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
    /* case action.type is 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION' */
    case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
      return {
        ...state, // keep previous state
        cart: {
          ...state.cart, // keep previous state.cart
          shippingAddress: {
            ...state.cart.shippingAddress, // keep previous state.cart.shippingAddress
            location: action.payload, // set location to action.payload
          },
        },
      };
    // case SAVE_PAYMENT_METHOD in the rducer
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state, // keep the fields of state as they are
        cart: {
          ...state.cart, // keep the fields of cart as they are
          // update paymentMethod with action.payload
          paymentMethod: action.payload,
        },
      };
    /* case action.type is 'CART_CLEAR' */
    case 'CART_CLEAR':
      return {
        ...state, // keep previous state
        cart: {
          ...state.cart, // keep previous state
          cartItems: [], // empty array
        },
      };
    /* case action.type is 'USER_SIGNIN' */
    case 'USER_SIGNIN':
      return {
        ...state, // keep previous state
        userInfo: action.payload, // set userInfo to action.payload
      };
    /* case action.type is 'USER_SIGNOUT' */
    case 'USER_SIGNOUT':
      return {
        ...state, // keep previous state
        userInfo: null, // set userInfo to null
        cart: {
          cartItems: [], // set cartItems to an empty array
          shippingAddress: {
            location: {}, // set to location to an empty object
          },
          paymentMethod: '', // set paymentMethod to an empty string
        },
      };
    default:
      return state; // return state as they are
  }
}

/* StoreProvider - is a Wrapper and pass global props to children */
/* Provedor de Loja */
/* Export  StoreProvider */
export function StoreProvider(
  { children } // get children
) {
  // get the state and dispatch from useReducer
  const [
    state, // [0] - get state from useReducer
    dispatch, // [1] - get dispatch from useReducer
  ] = useReducer(
    reducer, // 1st parameter
    initialState // 2nd parameter
  );

  /* define value object
   the value contain current state in the context and
   the dispatch to update state in the context */

  // context global data
  const value = {
    state, // current state
    dispatch,
  };

  // return Store ( is comming from react context )
  // get Provider from the Store object

  return (
    /* Provedor de loja */
    <Store.Provider value={value} /* pass value */>
      {children} {/* render {children}*/}
      {/* All React Components */}
    </Store.Provider>
  );
}
