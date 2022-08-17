import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';

export default function LoginScreen() {
  // get handleSubmit, register and formState from useForm hook
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // implement the submitHandler function
  const submitHandler = ({ email, password }) => {
    console.log(email, password);
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
              minLength: { value: 6, message: 'password is more than 5 chars' },
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
