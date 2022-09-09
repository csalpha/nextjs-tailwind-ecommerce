const cloudinary = require('cloudinary').v2;

// create upload api

// export function
export default function signature(
  req, // 1st param: request
  res // 2nd param: response
) {
  // get timestamp from Math.round method
  const timestamp = Math.round(
    new Date().getTime() / 1000 // round method accept a new Date
  );

  //
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    }, // 1st param
    process.env.CLOUDINARY_SECRET // 2nd param
  );

  // response statusCode is 200
  res.statusCode = 200;

  // json method pass an object
  res.json({ signature, timestamp });
}
