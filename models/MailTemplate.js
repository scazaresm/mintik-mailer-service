const mongoose = require('mongoose');

const mailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },  
  description: {
    type: String,
    required: true,
  },
  htmlContent: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true
  }
});

const MailTemplate = mongoose.model('MailTemplate', mailTemplateSchema, 'mail_templates');

module.exports = {MailTemplate, mailTemplateSchema};