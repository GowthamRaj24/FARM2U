import UserB from '@/models/UserB';
import dbConnect from '@/utils/dbConnect';

dbConnect();

export default async function deleteCart(req: any, res: any) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const userId = req.query.userId;
    const user = await UserB.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = []; // Remove all items from the cart
    await user.save();
    return res.status(200).json({ message: 'Deleted all products from your cart successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

