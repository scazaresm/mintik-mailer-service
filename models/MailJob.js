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