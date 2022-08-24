import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';

export default function Unauthorized() {
  // get router from useRouter
  const router = useRouter();
  // extract the message from the query string
  const { message } = router.query;

  return (
    /* Create a Layout */
    /* Unauthorized Page is the title */
    <Layout title="Unauthorized Page">
      {/* Create heading one */}
      <h1 className="text-xl">Access Denied</h1>
      {/* Show the message */}
      {message && <div className="mb-4 text-red-500">{message}</div>}
    </Layout>
  );
}
