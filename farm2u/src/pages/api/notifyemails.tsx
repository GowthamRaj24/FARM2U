import dbConnect from '../../utils/dbConnect';
import NotifyEmail from '../../models/Notifyemails';
import { NextApiRequest, NextApiResponse } from 'next';
dbConnect();
export default async (req:NextApiRequest,res:NextApiResponse)=>{
    const {method}=req;
    switch(method){
        case 'POST':
            const check=await NotifyEmail.findOne({email:req.body.email});
            if(check==null){
            try{
                const user=await NotifyEmail.create(req.body);
                return res.status(201).json({success:true,data:user})
            }
            catch(err){
                return res.status(400).json({success:false});
            }
            }
            else{
                return res.status(400).send("Already added!")
            }
        default:
            return res.status(400).json({success:false});
    }
}