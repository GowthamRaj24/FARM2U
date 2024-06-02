import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import Notifyemails from '@/models/Notifyemails';
export default async (req:NextApiRequest,res:NextApiResponse)=>{
    const {method}=req;
    switch(method){
        case 'POST':
            console.log(req.body)
            try{
                const transporter=nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // Set it to true if using a secure connection (TLS/SSL)
                    auth: {
                      user: process.env.ADMIN_EMAIL,
                      pass: process.env.ADMIN_EMAIL_PASS,
                    },
                }) 
                const subscribers=await Notifyemails.find();
                subscribers.forEach(async(subscriber)=>{
                    const options={
                        from:process.env.ADMIN_EMAIL,
                        to:`${subscriber.email}`,
                        subject:'New blog posted checkout!',
                        html:  ` <html>
                        <head>
                          <meta charset="utf-8">
                          <title>Contact Form Submission</title>
                          <style>
                            body {
                              font-family: Arial, sans-serif;
                              color: #333;
                            }
                            p{
                                font-size:12px;
                            }
                            .container {
                              max-width: 600px;
                              margin: 0 auto;
                              padding: 20px;
                            }
                            .logo img{
                              width:200px;
                              text-align: center;
                              margin-bottom: 20px;
                              margin-left:auto;
                              margin-right:auto;
                            }
                            .title {
                              text-align: center;
                              font-size: 18px;
                              margin-bottom: 10px;
                              border-bottom:0.2px solid grey;
                              font-weight:600;
                            }
                            .description {
                              margin-bottom: 20px;
                              line-height:1.5;
                              margin-top:20px;
                              margin-bottom:20px;
                            }
                            .underline {
                              height: 0.2px;
                              pacity:0.8;
                              background-color: grey;
                              margin-bottom: 10px;
                            }
                            .signature {
                            font-size:12px;
                              text-align: center;
                              color: rgb(155, 74, 8);
                            }
                          </style>
                        </head>
                        <body>
                          <div class="container">
                            <div class="logo">
                              <img src="https://user-images.githubusercontent.com/105535366/252154592-f392edc8-050b-486b-84f8-9b2d8dd0a217.png" alt="logo" />
                            </div>
                            <h1 class="title">${req.body.title}</h1>
                            <p class="description">${req.body.description}...<a href="http://localhost:3000">Continue reading</a></p>
                            <div class="underline"></div>
                            <p>Publish Date: ${req.body.publishDate}<p class="signature">Genmatrix Remedies</p></p>
                          </div>
                        </body>
                      </html>`
                    }
                    await transporter.sendMail(options)
                })
                return res.status(200).json({message:"Message sent to all subscribers!"})
                
            }
            catch(err){
                return res.status(200).json({message:"Cannot able sent to all subscribers!"})
            }
            break;
        default:
            return res.status(400).json({success:false});
    }
}