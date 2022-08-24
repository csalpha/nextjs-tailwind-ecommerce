import React from 'react';
{
  /* set active step to 0 */
}
export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className="mb-5 flex flex-wrap">
      {/*  steps of checkout array */}
      {['User Login', 'Shipping Address', 'Payment Method', 'Place Order']
        /* use map function to convert this array to divs */
        .map((step, index) => (
          <div
            key={step}
            className={`flex-1 border-b-2  
          text-center 
       ${
         index <= activeStep
           ? 'border-indigo-500   text-indigo-500' // active
           : 'border-gray-400 text-gray-400' // inactive
       }
          
       `}
          >
            {step}
          </div>
        ))}
    </div>
  );
}
