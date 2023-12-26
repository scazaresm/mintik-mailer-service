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

const db = require('./db');

const express = require('express');

const app = express();
const PORT = process.env.APP_PORT;

const mailerJobRoutes = require('./routes/index');
const processMailJobs = require('./processMailJobs');

app.use(express.json());
app.use('/jobs', mailerJobRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);

  db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

  db.once('open', () => {
    console.log('Connected to MongoDB');
    setInterval(processMailJobs, process.env.POLL_INTERVAL_MS || 5000);
  });
});


