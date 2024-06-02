import dbConnect from '@/utils/dbConnect';
import UserB from '@/models/UserB';
import generatedOtp from '@/models/generatedOtp'
dbConnect();
const bcrypt=require("bcrypt");
export default async (req: any, res: any) => {
    const { method } = req;
    const {email,otp,newPassword}=req.body
    switch (method) {
    case 'PATCH':
      try {
        const check=await generatedOtp.findOne({email:email});
        if(check && check.otp===otp){
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await UserB.findOneAndUpdate({email:email}, { password: hashedPassword }, { new: true });
        await generatedOtp.findOneAndDelete({ email: email });
        if (!updatedUser) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, message: 'Password updated successfully' });
        }
        else{
          return res.status(401).json({someerr:'otperr' });
        }
      } catch (error) {
        await generatedOtp.findOneAndDelete({ email: email });
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      break;
      default:
        res.status(400).json({ success: false, message: 'Invalid request method' });
        break;
    }
  };
  