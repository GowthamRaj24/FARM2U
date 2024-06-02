import UserB from '@/models/UserB';
import dbConnect from '@/utils/dbConnect';
dbConnect();
export default async function addToCart(req:any, res:any) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
    try {
      const userId=req.body.userId;
      const productId=req.body.productId;
      const user = await UserB.findOne({_id:userId});
      const existingProduct=await user.cart.find((item:any) =>item.productId===productId);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        user.cart.push({ productId:productId, quantity: 1 });
      }
      await user.save();
      return res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
    console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }