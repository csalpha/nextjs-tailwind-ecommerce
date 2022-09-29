// // import Axios from 'axios';
// // import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  useEffect,
  // useReducer
} from 'react';
// // import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';

// create OrderScreen function
export default function SellerScreen() {
  // OrderScreen implement
  // order/:id
  // get query from useRouter hook
  const { query } = useRouter();
  // get the orderId from query.id
  const userId = query.id;

  useEffect(() => {
    const fetchData = async () => {
      // try {
      //   const { data: user } = await Axios.get(`/api/users/sellers/${userId}`);
      // } catch (error) {
      // }
    };
    fetchData();
  }, [userId]);

  return (
    // create Layout, with title
    <Layout title={`Seller ${userId}`}>
      <div className="py-2">
        <Link href="/">back</Link>
      </div>
      {/* UI part inside the Layout */}
      {/* Show heading one 
      magin-bottom-4 and text-extra-large */}
      <h1 className="mb-4 text-xl">{`Order ${userId}`}</h1>
    </Layout>
  );
}
