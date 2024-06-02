import dbConnect from '@/utils/dbConnect';
import UserB from '@/models/UserB';
dbConnect();
export const config = { api: { bodyParser: { sizeLimit: '100mb' } } }
export default async (req:any,res:any)=>{
    const userId=req.query.userId;
    const {method}=req;
    switch(method){
        case 'POST':
            try {
                const {
                    firstName,
                    lastName,
                    phoneNumber,
                    address,
                    landmark,
                    city,
                    state,
                    pincode,
                    country
                }=req.body;
                const user = await UserB.findOne({_id:userId});
                user.address.push({
                    firstName,
                    lastName,
                    phoneNumber,
                    address,
                    landmark,
                    city,
                    state,
                    pincode,
                    country
                });
                await user.save();
                return res.status(200).json({ message: 'Address added successfully' });
              } catch (error) {
                console.error(error);
                console.log(error)
                return res.status(500).json({ message: 'Internal Server Error' });
              }
            break;
            case 'GET':
          UserB.findById(userId)
          .then(user=>{
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            else{
                return res.status(200).send(user.address);
            }
          })
          .catch(err => {
            console.error('Failed to find user:', err);
            return res.status(500).json({ error: 'Failed to remove address' });
          });
          break;
            default:
                return res.status(500).json({ message: 'Method Error' });
            break;
    }
}