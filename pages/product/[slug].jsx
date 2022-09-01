import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import Product from '../../models/Product';
import db from '../../utils/db';
import { toast } from 'react-toastify';
// Axios is a library to fetch data from backend api
import axios from 'axios';

// get props like parameter
export default function ProductScreen(props) {
  // from props get the product
  const { product } = props;
  // define state and dispatch equal to useContext
  const { state, dispatch } = useContext(Store);

  const router = useRouter();

  // if product does not exist
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  // define addToCart function

  const addToCartHandler = async () => {
    // define existItem
    /* find - search in the items of the cart for the product 
              that we have in this page                       */
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);

    //define quantity
    // if we have the product in the cart -> increase the quantity
    const quantity = existItem //true
      ? existItem.quantity + 1 // false
      : 1;
    // send an ajax request
    // implement api `/api/products/${product._id}`
    /*when  we put a id in this api, 
      api is be called and the product
      will be returned in a data variable*/
    const { data } = await axios.get(`/api/products/${product._id}`);

    /* check the countInStock in the database to make sure that we have
    stock/quantity in the database */
    if (data.countInStock < quantity) {
      // Show error
      return toast.error('Sorry, this item is temporarily out of stock');
    }

    // use the dispatch from the store provider
    // dispatch this action: CART_ADD_ITEM
    dispatch({
      type: 'CART_ADD_ITEM', // string
      // payload object
      payload: {
        ...product, // product properties
        quantity, // product quantity
      },
    });

    //redirect user to the cart
    // pass a new address as a parameter
    router.push('/cart');
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>B{product.price} €</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Define getServerSideProps ( async function )
// Paramenter: context
export async function getServerSideProps(context) {
  const { params } = context; // get the params in url from the context
  const { slug } = params; // get the slug from the params in the url

  // connect to the database
  await db.connect();

  /* use findOne on the Product Model and filter products
  based on  slug in the url, then use the lean to  convert it to
  JavaScript object and put it inside the props*/
  const product = await Product.findOne({ slug }).lean();
  // diconnecting from the database
  await db.disconnect();
  // return the props object
  return {
    props: {
      product: product // true
        ? db.convertDocToObj(product) // use convertDocToObj
        : // false
          null, // put null in the product
    },
  };
}
