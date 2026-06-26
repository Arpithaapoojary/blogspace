const sendEmail = async (options) => {
  // In a real application, you would configure nodemailer here.
  // For now, we'll just mock the email sending to the console.
  console.log('---------------------------------------------------------');
  console.log(`✉️ EMAIL MOCK`);
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message:\n${options.message}`);
  console.log('---------------------------------------------------------');
};

module.exports = sendEmail;
