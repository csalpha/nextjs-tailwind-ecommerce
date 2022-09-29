import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Link from 'next/link';

/* useContext - The main idea of using the context is to allow your components 
   to access some global data and re-render when that global data is changed.
*/

export default function Home({
  products, // pass products
}) {
  // get a object with state and dispatch from useContext
  const {
    state, // get state from useContext
    dispatch, // get dispatch from useContext
  } = useContext(
    Store // pass parameter
  );

  const {
    cart, // get cart from the state
    userInfo, //get userInfo from the state
  } = state;

  const [
    sellers, // [0] - get sellers from useState
    setSellers, // [1] - set Sellers
  ] = useState(
    [] // pass a empty array
  );

  useEffect(() => {
    const fetchData = async () => {
      // dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await Axios.get('/api/users/top-sellers');
        // dispatch({ type: 'FETCH_SUCCESS', payload: { products, sellers } });

        // call function
        setSellers(
          data // parameter
        );
      } catch (error) {
        // dispatch({
        //   type: 'FETCH_FAIL',
        //   payload: getError(error),
        // });
      }
    };

    fetchData();
  }, []);

  // define addCartHandler ( async function )
  const addToCartHandler = async (
    product // pass product
  ) => {
    const existItem = cart.cartItems.find(
      (x) => x.slug === product.slug // pass parameter
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await Axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        ...product, // keep values
        quantity, // update quantity
      },
    });

    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page">
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"> */}
      <div className="">
        <Carousel showArrows autoPlay showThumbs={false}>
          {sellers.map((seller) => (
            <div key={seller._id}>
              <Link href={`/seller/${seller._id}`}>
                <a>
                  <img src={seller.seller.logo} alt={seller.seller.name} />
                </a>
              </Link>
              <Link href={`/seller/${seller._id}`}>
                <a>
                  <p className="legend">{seller.seller.name}</p>
                </a>
              </Link>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* getting data from MongoDB */}
        {products.map((product) => (
          /* render ProductItem */
          <ProductItem
            product={product} // set product to product
            key={product.slug} // set key to product.slug
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
        {/* fetch data from the database */}
      </div>
    </Layout>
  );
}

// Implement getServerSideProps function from next.js
/* getServerSideProps function - runs before rendering the component
                               - provides data for the component     */
export async function getServerSideProps() {
  // connect to the database
  await db.connect();
  // get products from Product.find()
  const products = await Product.find().lean();
  // return object
  return {
    // define props object
    props: {
      // return products
      products: products.map(
        /* define function  to convert MongoDB docs
        to the javaScript object*/
        db.convertDocToObj
      ),
    },
  };
}
