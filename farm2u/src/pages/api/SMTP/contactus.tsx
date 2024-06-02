import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
export default async (req:NextApiRequest,res:NextApiResponse) => {
  const { name, email,phoneNumber,subject, message } = req.body;

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
      subject: 'New contact form submission',
      html:`
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Form Submission</title>
          <style>
              body {
                font-family: Arial, sans-serif;
              }
              h1 {
                color: #333;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              td {
                padding: 10px;
                border: 1px solid #ccc;
              }
            </style>
        </head>
        <body>
          <h1>New Contact Form Submission</h1>
          <table>
            <tr>
              <td>Name:</td>
              <td>${name}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>${email}</td>
            </tr>
            <tr>
              <td>Phone number:</td>
              <td>${phoneNumber}</td>
            </tr>
            <tr>
              <td>Subject:</td>
              <td>${subject}</td>
            </tr>
            <tr>
              <td>Message:</td>
              <td>${message}</td>
            </tr>
          </table>
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
