const MailJob = require('./models/MailJob');
const {MailTemplate} = require('./models/MailTemplate');

const nodemailer = require('nodemailer');

function createTransporter() {
    const service = process.env.SENDER_SERVICE;

    if (service) {
        return nodemailer.createTransport({
            service,
            auth: {
                user: process.env.SENDER_ADDRESS,
                pass: process.env.SENDER_PASS,
            },
        }); 
    }
    return nodemailer.createTransport({
        host: process.env.SENDER_HOST,
        port: process.env.SENDER_PORT,
        secure: process.env.SENDER_SECURE,
        auth: {
            user: process.env.SENDER_ADDRESS,
            pass: process.env.SENDER_PASS,
        },
    }); 
} 

async function buildHtmlFromTemplate(template, contentVariables) {
    // replace all variables in the html template
    let html = template.htmlContent;
    for(const variable of contentVariables) {
        const variableParts = variable.split('=');
        if(variableParts.length == 2) {
            // use regular expression and global flag to replace all occurrences
            html = html.replace(
                new RegExp(variableParts[0].trim(), 'g'), 
                variableParts[1].trim()
            );
        }
    }
    return html;
}

async function sendMail(job) {
    const mailTemplate = await MailTemplate.findOne({name: job.templateName});
    if(!mailTemplate) {
        throw new Error(`Template ${job.templateName} does not exist.`)
    }

    if(!mailTemplate.enabled) {
        console.log('Will skip email sending because template is disabled.')
        return;
    }
    
    const mailOptions = {
        from: process.env.SENDER_ADDRESS,
        to: job.to,
        subject: job.subject,
        html: await buildHtmlFromTemplate(mailTemplate, job.contentVariables),
    };
    await createTransporter().sendMail(mailOptions);
}

async function processMailJobs() {
    try {
        console.log(`Polling queued jobs...`)
        const latestJobs = await MailJob.find({ status: "Queued" });

        if(latestJobs && latestJobs.length > 0) {
            console.log(`Found ${latestJobs.length} queued jobs.`)
        }

        for (const job of latestJobs) {
            console.log(`Processing ${job._id}`)
            try {
                job.status = "Sending";
                job.processedAt = new Date();

                await MailJob.updateOne(
                    { _id: job._id }, 
                    {
                        $set: {
                            status: job.status,
                            processedAt: job.processedAt,
                        },
                    }
                );
                await sendMail(job);
                job.status = 'Sent';
                console.log(`${job._id} succeeded!`)
            } catch (sendError) {
                job.status = "Failed";
                job.errorMessage = sendError;
                console.log(`Error while processing ${job._id}: ${sendError}`)
            } finally {
                await MailJob.updateOne(
                    { _id: job._id },
                    {
                        $set: {
                            status: job.status,
                            errorMessage: job.errorMessage,
                        },
                    }
                );
            }
            // wait to process the next job
            await new Promise(resolve => setTimeout(resolve, process.env.WAIT_MS || 1000));
        }
    } catch (processingError) {
        console.error('Error while processing queued jobs:', processingError);
    }
}

module.exports = processMailJobs;

