export default function asyncErrorHandler(
  promise,
  message = 'Something went wrong, please check and try again'
) {
  return promise.catch(err => {
    console.error(err);
    throw new Error(message);
  });
}
