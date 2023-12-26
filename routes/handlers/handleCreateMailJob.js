
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

const MailJob = require('../../models/MailJob');

async function handleCreateMailJob(req, res) {
  try {
    const {
      templateName,
      contentVariables,
      subject,
      to,
    } = req.body;

    if (!templateName) {
      return res.status(400).json({error: 'templateName is missing in body object.'});
    }
    if (!contentVariables) {
      return res.status(400).json({error: 'templateName is missing in body object.'});
    }
    if (!subject) {
      return res.status(400).json({error: 'subject is missing in body object.'});
    }
    if (!to) {
      return res.status(400).json({error: '-to- is missing in body object.'});
    }

    const newMailJob = new MailJob({
      templateName,
      contentVariables,
      subject,
      to,
    });

    const savedMailJob = await newMailJob.save();
    res.status(201).json(savedMailJob);
  } catch (error) {
    console.error('Error while creating mail job:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}

module.exports = handleCreateMailJob;
