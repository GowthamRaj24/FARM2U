import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product_s';
import { getToken } from 'next-auth/jwt';
dbConnect();
export const config = { api: { bodyParser: { sizeLimit: '100mb' },responseLimit:false } }
export default async (req:any,res:any)=>{
    const {method}=req;
    switch(method){
        case 'POST':
            try{
                const session:any=await getToken({req});
                if(!session || session.user.role!=="seller"){
                    return res.status(401).json({message:"unauthorized"})
                }
                const data=req.body;
                Object.assign(data,{seller:session.user._id,sellerName:session.user.firstname+session.user.lastname,comments:[]});
                const user=await Product.create(data);
                return res.status(201).json({success:true,data:user})
            }
            catch(err){
                console.log(err);
                return res.status(400).json({success:false});
            }
            break;
        case 'GET':
            try{
                const products=await Product.find({}, "-image2 -image3 -image4 -description");
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