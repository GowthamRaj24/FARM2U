import dbConnect from '@/utils/dbConnect';
import UserB from '@/models/UserB';

dbConnect();

export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

export default async (req: any, res: any) => {
  const userId = req.query.userId;
  const addressId = req.query.addressId;
  const { method } = req;

  switch (method) {
    case 'DELETE':
      try {
        const user = await UserB.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const addressIndex = user.address.findIndex((address:any) => address._id.toString() === addressId);
        if (addressIndex === -1) {
          return res.status(404).json({ error: 'Address not found' });
        }
        user.address.splice(addressIndex, 1);
        await user.save();
        res.json({ message: 'Address removed successfully' });
      } catch (error) {
        console.error('Failed to remove address:', error);
        return res.status(500).json({ error: 'Failed to remove address' });
      }
      break;

    default:
      return res.status(400).json({ error: 'Something went wrong' });
  }
};
