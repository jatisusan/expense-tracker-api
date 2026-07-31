export const notFoundHandler = (req, res, next) => {
  let error = new Error(`Route Not Found - ${req.method} - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
