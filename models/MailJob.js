const mongoose = require('mongoose');

const mailJobSchema = new mongoose.Schema({
    templateName: {
        type: String,
        required: true,
    },  
    contentVariables: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['Queued', 'Sending', 'Sent', 'Failed'],
        default: 'Queued',
    },
    queuedAt: {
        type: Date,
        default: Date.now,
    },
    processedAt: {
        type: Date,
        required: false,
    },
    errorMessage: {
        type: String,
        required: false,
    },
    subject: {
        type: String,
        required: true,
    },
    to: {
        type: [String],
        required: false,
    },
});

const MailJob = mongoose.model('MailJob', mailJobSchema, 'mail_jobs');

module.exports = MailJob;