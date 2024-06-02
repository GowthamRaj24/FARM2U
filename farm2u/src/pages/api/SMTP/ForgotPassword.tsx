import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import generatedOtp from '@/models/generatedOtp'
import UserB from '@/models/UserB';
export default async (req:NextApiRequest,res:NextApiResponse)=>{
    const {method}=req;
    const {email}=req.body;
    switch(method){
        case 'POST':
            console.log(req.body)
            try{
              const user = await UserB.findOne({ email }); 
              if (!user) {
                return res.status(401).json({emailerr:'Email does not exist.' });
              }
                const transporter=nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // Set it to true if using a secure connection (TLS/SSL)
                    auth: {
                      user: process.env.ADMIN_EMAIL,
                      pass: process.env.ADMIN_EMAIL_PASS,
                    },
                }) 
                const generateOTP=()=> {
                    var digits = '0123456789';
                    var otp = '';
                    for (var i = 0; i < 6; i++) {
                      otp += digits[Math.floor(Math.random() * 10)];
                    }
                    return otp;
                }
                const otp=generateOTP()
                    const options={
                        from:process.env.ADMIN_EMAIL,
                        to:`${email}`,
                        subject:'Customer account password reset',
                        html:  ` <html>
                        <head>
                          <meta charset="utf-8">
                          <title>Contact Form Submission</title>
                          <style>
                            body {
                              font-family: Arial, sans-serif;
                              color: #333;
                            }
                            .container{
                              
                              max-width: 600px;
                              padding: 20px;
                            }
                            img{
                              width:200px;
                              text-align: center;
                              margin-bottom: 20px;
                              margin-left:auto;
                              margin-right:auto;
                            }
                          </style>
                        </head>
                        <body>
                        <div class="container">
                          <div style="font-family: Helvetica,Arial,sans-serif;overflow:auto;line-height:2">
                            <div style="margin:50px auto;width:70%;padding:20px 0">
                                <div style="border-bottom:1px solid #eee">
                                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"><img src="https://user-images.githubusercontent.com/105535366/252154592-f392edc8-050b-486b-84f8-9b2d8dd0a217.png" alt="logo" /></a>
                                </div>
                                <p style="font-size:1.1em">Hi,</p>
                                <p>Use the following OTP to complete your forgot password procedures. This one time password is valid only for 5min.</p>
                                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                                <p style="font-size:0.9em;">Regards,<br />GENMATRIX REMEDIES</p>
                                <hr style="border:none;border-top:1px solid #eee" />
                                </div>
                            </div>
                            </div>
                        </body>
                      </html>`
                    }
                    await transporter.sendMail(options)
                    try{    
                      try{
                        const dataBlocks=await generatedOtp.findOne({email:email});
                        if(dataBlocks){
                          await generatedOtp.findOneAndUpdate({email:email},{otp:otp})
                        }
                        else{
                          const otpM=await generatedOtp.create({email:email,otp:otp});
                        }
                      } 
                      catch(err){
                        console.log(err);
                        return res.status(401).json({someerr:'Something wrong' });
                      }                
                      return res.status(201).json({success:true,message:"Otp sent!"})
                      }
                    catch(err){
                      console.log(err)
                      return res.status(401).json({someerr:'Something wrong' });
                    }
            }
            catch(err){
                return res.status(200).json({message:"Cannot able sent otp!"})
            }
            break;
        default:
            return res.status(400).json({success:false});
    }
}