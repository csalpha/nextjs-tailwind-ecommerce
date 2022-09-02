import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

/* implement the register page
   when user click on login we
   have register
 */
export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm(); // from useForm get handleSubmit,register, getValues

  const submitHandler = async ({ name, email, password }) => {
    // create a new user in backend
    try {
      // send an ajax request to this api, '/api/auth/signup'
      await axios.post('/api/auth/signup', {
        // post request
        // pass name, email and password
        name,
        email,
        password,
      });
      // the login user using signIn function
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        /* if there is an error
           show error           */
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Create Account">
      {/* form */}
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Create Account</h1>
        {/* Name box */}
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus // first field
            {...register('name', {
              // register it as name
              required: 'Please enter name',
            })}
          />
          {/* if there is an error */}
          {errors.name && (
            /* show the errors.name.message */
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
        {/* Email box */}
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
            className="w-full"
            id="email"
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        {/* PassWord box */}
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 4, message: 'password is more than 3 chars' },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        {/* Confirm Password box */}
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword" // connect id to label using htmlFor
            {...register(
              // register in react hook form
              'confirmPassword',
              /* name of field */
              {
                /* options */ required: 'Please enter confirm password',
                /* check the value in this input box
                   with the value in password input 
                   if they are not equal show error message 
                   'Password do not match' */
                validate: (value) => value === getValues('password'),
                // getValues is coming from react hook form
                minLength: {
                  value: 4,
                  message: 'confirm password is more than 3 chars',
                },
              }
            )}
          />
          {/* fist error box: regular error */}
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {/** second error box: Password do not match */}
          {/* check the password in the password input box
          with the value in the confirm password input box,
          if they are not equal to each other show error message */}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>

        <div className="mb-4 ">
          <button className="primary-button">Register</button>
        </div>
        <div className="mb-4 ">
          Don&apos;t have an account? &nbsp;
          {/* check the redirect
          if redirect does exist use it
          otherwise redirect user to the home page */}
          <Link href={`/register?redirect=${redirect || '/'}`}>Register</Link>
        </div>
      </form>
    </Layout>
  );
}
