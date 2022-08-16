import { createContext, useReducer } from 'react';

// call createContext()
export const Store = createContext();

// define initial state
const initialState = {
  cart: { cartItems: [] },
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

      // return updated cart items
      return {
        ...state, // keep the previous state
        cart: {
          ...state.cart, // keep the previous values in the cart
          cartItems, // update the cartItems
        }, // update the cart
      };
    }
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
