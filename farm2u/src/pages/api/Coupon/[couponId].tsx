import { NextApiRequest, NextApiResponse } from 'next';
import Coupons from '../../../models/Coupons';
import dbConnect from '@/utils/dbConnect';
dbConnect();
export default async(req:NextApiRequest,res:NextApiResponse)=>{
    const {method}=req;
    const {couponId}=req.query;
    switch(method){
        case 'PATCH':
            try{
                const coupon=await Coupons.findByIdAndUpdate(couponId,req.body);
                return res.status(200).json(coupon);
            }
            catch(err){
                return res.status(400).json({success:false})
            }
        default:
            return res.status(400).json({success:false});
    }
}