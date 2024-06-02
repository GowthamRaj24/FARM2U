import { NextApiRequest, NextApiResponse } from 'next';
import Coupons from '../../../models/Coupons';
import dbConnect from '@/utils/dbConnect';
dbConnect();
export default async(req:NextApiRequest,res:NextApiResponse)=>{
    const {method}=req;
    switch(method){
        case 'POST':
            try{
                const coupon=await Coupons.create(req.body);
                return res.status(201).json({success:true,data:coupon});
            }
            catch(err){
                return res.status(400).json({success:false})
            }
        default:
            return res.status(400).json({success:false});
    }
}