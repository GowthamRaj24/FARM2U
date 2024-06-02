import { NextApiRequest, NextApiResponse } from 'next';
import Coupons from '../../../models/Coupons';
import dbConnect from '@/utils/dbConnect';
dbConnect();
export default async(req:NextApiRequest,res:NextApiResponse)=>{
    const {method}=req;
    switch(method){
        case 'GET':
            try{
                const coupon=await Coupons.find();
                return res.status(200).json(coupon[0]);
            }
            catch(err){
                return res.status(400).json({success:false})
            }
        default:
            return res.status(400).json({success:false});
    }
}