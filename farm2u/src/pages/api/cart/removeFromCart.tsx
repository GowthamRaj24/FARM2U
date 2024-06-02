import UserB from '@/models/UserB';
import dbConnect from '@/utils/dbConnect';

dbConnect();

export default async function addToCart(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const user = await UserB.findOne({ _id: userId });
    const existingProductIndex = user.cart.findIndex((item: any) => item.productId === productId);
    if (existingProductIndex !== -1) {
      const existingProduct = user.cart[existingProductIndex];
      if (existingProduct.quantity > 0) {
        existingProduct.quantity -= 1;
        if (existingProduct.quantity === 0) {
          user.cart.splice(existingProductIndex, 1);
        }
      } else {
        return res.status(200).json({ message: 'No such Product in your cart' });
      }
    } else {
      return res.status(200).json({ message: 'No such Product in your cart' });
    }
    await user.save();
    return res.status(200).json({ message: 'Removed product from your cart successfully' });
  } catch (error) {
    res.end();
  }
}
