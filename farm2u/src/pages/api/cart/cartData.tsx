import dbConnect from '@/utils/dbConnect';
import UserB from '@/models/UserB';
dbConnect();
const jwt=require('jsonwebtoken');
const bcrypt=require("bcrypt");
export default async (req:any,res:any)=>{
    const {method}=req;
    switch(method){
        case 'POST':
            const userdata=await UserB.findOne({_id:req.body.id});
            return res.json(userdata.cart);
        default:
            return res.status(400).json({success:false});
        }
    }