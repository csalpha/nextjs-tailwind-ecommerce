import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import axios from 'axios';
import Layout from '../components/Layout';

export default function ProfileScreen() {
  // get session from useSession method
  const { data: session } = useSession();

  /* {
      handleSubmit,
      register,
      getValues,
      setValue,
      formState: { errors } } 
      from useForm hook */
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  // define useEffect
  /* fill the input boxes based on the data in session */
  /* when there is a change in the session 
  useEffect runs*/
  useEffect(
    () => {
      // updates name with session.user.name
      setValue('name', session.user.name);
      // updates email with session.user.email
      setValue('email', session.user.email);
    }, // first parameter is a function
    [session.user, setValue] // second parameter: dependecies
  );

  // define submitHandler ( async function )
  const submitHandler = async ({ name, email, password }) => {
    try {
      // send an ajax request to this api,'/api/auth/update'
      await axios.put(
        '/api/auth/update', // first parameter: address api
        {
          // put request
          // pass name, email and password
          name,
          email,
          password,
        } // second parameter: object with name, email, password
      );
      // the login user, using signIn function
      // signIn accept credentials object
      const result = await signIn(
        'credentials', // first parameter: name
        {
          redirect: false,
          email,
          password,
        } // second parameter: object
      );
      // show success message
      toast.success('Profile updated successfully');
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
    /* use Layout and set title: Profile */
    <Layout title="Profile">
      {/* Create form */}
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        {/* Create heading one, set title: Update Profile 
        margin-bottom-4 text-extra-large */}
        <h1 className="mb-4 text-xl">Update Profile</h1>
        {/* first div with margin-bottom-four */}
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-full"
            id="name" // connect input to label using htmlFor
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
        {/* Email box with margin-bottom-four */}
        <div className="mb-4">
          {/* create a label and connect the label
             to this input box, using htmlFor  */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full"
            id="email" // connect input to label
            {...register(
              'email',
              //validation options
              {
                required: 'Please enter email',
                // email pattern
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: 'Please enter valid email',
                },
              }
            )}
          />
          {/* if there is an error */}
          {errors.email && (
            /* show the errors.name.message */
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        {/* Password box with margin-bottom-four */}
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            className="w-full"
            type="password"
            id="password" // connect input to label using htmlFor
            {...register('password', {
              minLength: { value: 4, message: 'password is more than 3 chars' },
            })}
          />
          {/* if there is an error */}
          {errors.password && (
            /* show the errors.name.message */
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        {/* confirmPassword box with margin-bottom-four */}
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword" // connect id to label using htmlFor
            {...register(
              // register in react hook form
              'confirmPassword' /* name of field */,
              {
                /* check the value in this input box
                   with the value in password input 
                   if they are not equal show error message 
                   'Password do not match' */
                // getValues is coming from react hook form
                validate: (value) => value === getValues('password'),
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
        {/* button box with margin-bottom-four */}
        <div className="mb-4">
          <button className="primary-button">Update Profile</button>
        </div>
      </form>
    </Layout>
  );
}

// only the authenticated user can access the ProfileScreen
// set ProfileScreen to authenticate it
ProfileScreen.auth = true;
