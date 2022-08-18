const getError = (err) =>
  err.response && err.response.data && err.response.data.message
    ? // if exists return
      err.response.data.message
    : // else return
      err.message;

export { getError };
