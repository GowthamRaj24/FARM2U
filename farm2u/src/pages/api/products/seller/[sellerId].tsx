import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product_s';
import { getToken } from 'next-auth/jwt';
dbConnect();
export const config = { api: { bodyParser: { sizeLimit: '100mb' },responseLimit:false } }
export default async (req:any,res:any)=>{
    const {method}=req;
    const sellerId=req.query.sellerId;
    switch(method){
        case 'GET':
            try{
                const products=await Product.find({seller:sellerId}, "-image2 -image3 -image4 -description");
                if(products){    
                    return res.status(200).json(products)}
                else{
                    return res.status(404).json({});
                }
            }
            catch(err){
                return res.status(400).json({success:false});
            }
            break;
        default:
            return res.status(400).json({success:false});
    }
}