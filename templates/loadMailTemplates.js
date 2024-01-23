const fsPromises = require('fs').promises;
const path = require('path');
const fileExists = require('../utils/fileExists');
const readFileAsText = require('../utils/readFileAsText');

const {MailTemplate} = require('../models/MailTemplate');

async function loadMailTemplates() {
  console.log('Loading mail templates into db...');

  const directoryPath = path.join(process.env.APP_DIR, 'templates', 'html');
  const allHtmlFiles = await fsPromises.readdir(directoryPath);

  // Create an array of promises for each file processing task
  const promises = allHtmlFiles.map(async (htmlFileName) => {
    const htmlFilePath = path.join(directoryPath, htmlFileName);
    if (!await fileExists(htmlFilePath)) return;

    console.log(`\tLoading ${htmlFileName}...`);
    const htmlContent = await readFileAsText(htmlFilePath);
    const templateName = htmlFileName.replace('.html', '');

    // try to find a template document in db matching with this HTML file name
    let templateDocument = await MailTemplate.findOne({name: templateName});

    if (!templateDocument) {
      // insert the new mail template
      templateDocument = new MailTemplate({
        name: templateName,
        htmlContent,
        enabled: true,
      });
    } else {
      // update the existing mail template HTML
      templateDocument.htmlContent = htmlContent;
    }

    await templateDocument.save();
  });

  // Use Promise.all to wait for all promises to be resolved
  await Promise.all(promises);

  console.log('Successfully loaded all mail templates.');
}

module.exports = loadMailTemplates;

