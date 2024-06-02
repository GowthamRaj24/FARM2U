import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
export default async (req:NextApiRequest,res:NextApiResponse) => {
  try {
    // Create a nodemailer transporter using your email provider's SMTP settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Set it to true if using a secure connection (TLS/SSL)
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });
    // Create an email message
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'New order recieved for checkout.',
      html:`
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New order recieved for checkout.</title>
          <style>
              body {
                font-family: Arial, sans-serif;
              }
              h1 {
                color: #333;
              }
            </style>
        </head>
        <body>
          <h1>New order recieved for checkout.</h1>
          <a href="https://genmatrix.in">https://genmatrix.in</a>
        </body>
      </html>
    `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return a success response
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    // Return an error response
    return res.status(500).json({ message: 'Failed to send email' });
  }
};
