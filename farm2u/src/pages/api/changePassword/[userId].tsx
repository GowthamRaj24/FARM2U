import dbConnect from '@/utils/dbConnect';
import UserB from '@/models/UserB';
dbConnect();
const bcrypt=require("bcrypt");
export default async (req: any, res: any) => {
    const userId = req.query.userId;
    const { method } = req;
  
    switch (method) {
      case 'POST':
        try {
          const  oldPassword = req.body.oldPassword;
          const user = await UserB.findById(userId);
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if (isMatch) {
            return res.json({ success: true, message: 'Old password matches' });
          } else {
            return res.json({ success: false, message: 'Old password does not match' });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        break;
    case 'PATCH':
      try {
        const newPassword = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await UserB.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        if (!updatedUser) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, message: 'Password updated successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      break;
      default:
        res.status(400).json({ success: false, message: 'Invalid request method' });
    }
  };
  