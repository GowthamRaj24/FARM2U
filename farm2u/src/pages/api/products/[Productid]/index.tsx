import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product_s';
import { getToken } from 'next-auth/jwt';
dbConnect();
export const config = { api: { bodyParser: { sizeLimit: '100mb' } } }
export default async (req:any,res:any)=>{
    const Productid=req.query.Productid;
    const {method}=req;
    switch(method){
        case 'GET':
            try{
                const product=await Product.findOne({_id:Productid});
                if(product){    
                    return res.status(200).json(product)}
                else{
                    return res.status(404).send("iderror");
                }
            }
            catch(err){
                return res.status(404).send("iderror");
            }
        case 'POST':
            try {
                const product = await Product.findOne({_id:Productid});
                product.comments.push({ name:req.body.name,rating:req.body.rating, comment:req.body.comment, publishDate:Date.now()});
                await product.save();
                return res.status(200).json({ message: 'Comment added to product successfully' });
              } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
              }
        case 'DELETE':
            try{
                const session:any=await getToken({req});
                if(!session || session.user.role!=="seller"){
                    return res.status(401).json({message:"unauthorized"})
                }
                await Product.findByIdAndDelete(Productid);
                return res.status(200).send('delted');
            }
            catch(err){
                return res.status(401).send("iderror");
            }
        case 'PATCH':
            try{
                const session:any=await getToken({req});
                if(!session || session.user.role!=="seller"){
                    return res.status(401).json({message:"unauthorized"})
                }
                await Product.findByIdAndUpdate(Productid,req.body);
                return res.status(200).send('edited');
            }
            catch(err){
                return res.status(401).send("iderror");
            }
            break;
        default:
            return res.status(400).json({success:false});
    }
}