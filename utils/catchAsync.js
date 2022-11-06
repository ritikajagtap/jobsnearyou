//async function returns a promise, if it fails to return the promise it goes into the catch block...

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
