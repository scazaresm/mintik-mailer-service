
const MailJob = require('../../models/MailJob');

async function handleCreateMailJob(req, res) {
  try {
    const { 
      templateName, 
      contentVariables,
      subject,
      to
    } = req.body;

    if (!templateName) {
      return res.status(400).json({ error: 'templateName is missing in body object.' });
    }
    if (!contentVariables) {
      return res.status(400).json({ error: 'templateName is missing in body object.' });
    }
    if (!subject) {
      return res.status(400).json({ error: 'subject is missing in body object.' });
    }
    if (!to) {
      return res.status(400).json({ error: '-to- is missing in body object.' });
    }

    const newMailJob = new MailJob({
      templateName,
      contentVariables,
      subject,
      to
    });

    const savedMailJob = await newMailJob.save();
    res.status(201).json(savedMailJob);
  } catch (error) {
    console.error('Error while creating mail job:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = handleCreateMailJob;