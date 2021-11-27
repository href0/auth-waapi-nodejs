import Users from "../models/UserModel.js";
import Otp from "../models/OtpModel.js";
import jwt from "jsonwebtoken";
export const getOtp = async (req, res) => {
    try {
        const otp = await Otp.findOne({
            limit:1,
            where:{
                nohp:req.body.nohp
            },
            order:[ [ 'createdAt', 'DESC' ]]
        })
        res.json(otp)
    } catch (error) {
        console.log(error)
    }
}
export const verifyOtp = async(req, res) => {
    try {
        const nohp = req.body.nohp
        const code = req.body.code
        const otp = await Otp.findOne({
            limit:1,
            where:{
                nohp:nohp
            },
            order: [ ['expired', 'DESC'] ]
        })
        if(!otp) return res.status(403).json({msg:"An Error Occured"});
        if(otp.code != code) return res.status(406).json({msg:"Invalid Code"})
        if(otp.expired < Date.now()) return res.status(406).json({msg:"Expired Code"})
        const uNohp = otp.nohp
        const uName = otp.name
        const accesToken = jwt.sign({uNohp, uName}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn : '20s'
        });
        const refreshToken = jwt.sign({uNohp, uName}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn : '1d'
        });
        await Users.update({refresh_token:refreshToken},{
                where:{
                    nohp:uNohp
                }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly:true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.clearCookie('otpToken')
        res.json({accesToken});
    } catch (error) {
        res.status(404).json({msg:error});
    }
}