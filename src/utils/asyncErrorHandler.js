export default function asyncErrorHandler(promise) {
  return promise.catch(err => {
    throw err;
  });
}
