import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product_s';
import { getToken } from 'next-auth/jwt';
dbConnect();
export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };
export default async (req: any, res: any) => {
  const { method } = req;
  switch (method) {
    case 'PATCH':
      try {
        const productId = req.body.productId;
        const { quantity } = req.body;        // Get the quantity from the request body
        if (typeof quantity !== 'number' || quantity <= 0) {  // Check if the quantity is a valid number
          return res.status(400).json({ message: 'Invalid quantity' });
        }
        const product = await Product.findOne({_id:productId});   // Find the product by ID in the database
        if (!product) {
          console.log("yes")
          return res.status(404).json({ message: 'Product not found' });
        }
        product.qty -= quantity; // Reduce the current quantity by the specified amount
        await product.save(); // Save the updated product in the database
        return res.status(200).json({ message: 'Quantity updated successfully', product });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
    default:
      return res.status(400).json({ success: false });
  }
};
