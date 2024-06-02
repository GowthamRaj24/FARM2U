import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product_s';
dbConnect();
export const config = { api: { bodyParser: { sizeLimit: '100mb' },responseLimit:false } }
export default async (req:any,res:any)=>{
    const Productid=req.query.searchText;
    const {method}=req;
    switch(method){
        case 'GET':
            try {
                const products = await Product.find({
                  $or: [
                    { heading: { $regex: Productid, $options: 'i' } }, // Case-insensitive title search
                ],
                }, "-image2 -image3 -image4 -description");
                res.json(products);
              } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
              }
            break;
        default:
            return res.status(400).json({success:false});
    }
}