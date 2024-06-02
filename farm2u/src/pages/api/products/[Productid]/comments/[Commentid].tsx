import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product_s';
import { getToken } from 'next-auth/jwt';

dbConnect();

export default async (req: any, res: any) => {
  const Productid = req.query.Productid;
  const Commentid = req.query.Commentid;
  const { method } = req;
console.log("hi")
  switch (method) {
    case 'DELETE':
      try {
        const session:any=await getToken({req});
                if(!session || session.user.role!=="seller"){
                    return res.status(401).json({message:"unauthorized"})
                }
        const product = await Product.findById(Productid);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        const commentIndex = product.comments.findIndex((comment:any) => comment._id.toString() === Commentid);
        if (commentIndex === -1) {
          return res.status(404).json({ error: 'comments not found' });
        }
        product.comments.splice(commentIndex, 1);
        await product.save();
        return res.json({ message: 'comments removed successfully' });
      } catch (error) {
        console.error('Failed to remove comments:', error);
        return res.status(500).json({ error: 'Failed to remove comments' });
      }
      break;

    default:
      return res.status(400).json({ error: 'Something went wrong' });
  }
};
