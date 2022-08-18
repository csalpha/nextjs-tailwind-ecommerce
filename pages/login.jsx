import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function LoginScreen() {
  // get the data ( rename to session ) from useSession hook, from next-auth

  const { data: session } = useSession();

  // router is comming for useRouter
  const router = useRouter();

  // extract redirect object from router.query object
  const { redirect } = router.query;

  // define useEffect
  /* when there is a change in the session 
  useEffect runs and here session.user has value and redirect user*/
  useEffect(() => {
    // check session
    if (session?.user) {
      // user logged in already
      /* get the redirect from the query string, 
      if it doesn't exist, redirect user to the homepage */
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  // get handleSubmit, register and formState from useForm hook
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // implement the submitHandler function
  const submitHandler = async ({ email, password }) => {
    try {
      // call signIn function from next-auth
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    /* Login Screen page */
    <Layout title="Login">
      {/* form */}
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
        {/* Email box */}
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          {/* register email in input boxes */}
          <input
            type="email"
            {...register(
              'email', // email
              {
                //validation options
                required: 'Please enter email',
                // check email pattern
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  // if the entered email is not like this pattern show message
                  message: 'Please enter valid email',
                },
              }
            )}
            className="w-full"
            id="email"
            autoFocus
          ></input>
          {/* Expression that check errors */}
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        {/* PassWord box */}
        {/* register password in input boxes */}
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Please enter password',
              /* password validation */
              minLength: { value: 3, message: 'password is more than 5 chars' },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {/* Expression that check errors */}
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4 ">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4 ">
          Don&apos;t have an account? &nbsp;
          <Link href="register">Sign Up</Link>
        </div>
      </form>
    </Layout>
  );
}
