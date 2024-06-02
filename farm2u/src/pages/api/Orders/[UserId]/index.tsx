import dbConnect from "@/utils/dbConnect";
import Orderi from "@/models/Orderi";
import { NextApiRequest, NextApiResponse } from "next";
dbConnect();
export const config = {
    api: {
      responseLimit: false,
    },
  }
export default async (req:NextApiRequest,res:NextApiResponse)=>{
    const {method}=req;
    const UserId=req.query.UserId;
    switch(method){
        case 'GET':
            try{
                const orders=await Orderi.find({userId:UserId}).populate('products.productId', 'image1 heading');
                return res.status(200).json({success:true,data:orders})
            }
            catch(err){
                console.log(err)
                return res.status(400).json({success:false});
            }
            break;
          default:
            return res.status(400).json({ success: false });
            break;
    }
}