
// Commons Clause License
//
// The Software is provided to you by the Licensor under the License, as
// defined below, subject to the following condition.
//
// Without limiting other conditions in the License, the grant of rights
// under the License will not include, and the License does not grant to you,
// the right to sell, leverage, or otherwise commercialize the Software.
//
// For purposes of the foregoing, "sell" means practicing any or all of the
// rights granted to you under the License to provide to third parties,
// for a fee or other consideration (including without limitation fees
// for hosting or consulting/ support services related to the Software),
// a product or service whose value derives, entirely or substantially,
// from the functionality of the Software.
//
// Any license notice or attribution required by the License must also
// include this Commons Clause License Condition notice.
//
// Software: mintik-mailer-service
// License: MIT License
// Licensor: Sergio Cazares
// Commons Clause License URL: https://github.com/scazaresm/mintik-mailer-service/blob/main/LICENSE

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
