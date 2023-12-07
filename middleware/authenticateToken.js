
const axios = require('axios');

const authenticateToken = (req, res, next) => {
  const apiUrl = process.env.AUTHENTICATION_SERVICE_URL;

  const headers = {
    'Authorization': req.headers.authorization,
  };

  axios.get(`${apiUrl}/authenticate-token`, {
    headers: headers,
  })
      .then((response) => {
        // user is authenticated, set user data in req object for further use
        req.user = response.data;
        next();
      })
      .catch((error) => {
        if (error.response) {
          // user is not authenticated
          const errorData = error.response.data;
          const statusCode = error.response.status;
          return res.status(statusCode).json(errorData);
        } else {
          return res.status(500).json({
            error: 'Internal server error during authentication.',
          });
        }
      });
};

module.exports = authenticateToken;
