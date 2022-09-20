import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
// import { Carousel } from 'react-responsive-carousel';

export default function Home({ products }) {
  // get a object with state and dispatch from useContext
  const { state, dispatch } = useContext(Store);
  // get cart from the state
  const { cart } = state;

  // define addCartHandler ( async function )
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* getting data from MongoDB */}
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
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
