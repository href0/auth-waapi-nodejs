import Users from "../models/UserModel.js";
import Otp from "../models/OtpModel.js";
import jwt from "jsonwebtoken";
import { sendOTP } from "../index.js";
import { phoneNumberFormatter } from "../helper/formatter.js";
export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll()
        res.json({users})
    } catch (error) {
        console.log(error)
    }
}

export const Register = async (req, res) => {
    const { name, nohp } = req.body;
    try {
        await Users.create({
            name:name,
            nohp:nohp
        })
        res.json({msg:'register berhasil'})
    } catch (error) {
        console.log(error)
    }
}

export const Login = async (req, res) => {
     const code = Math.floor(100000+Math.random()*900000)
     const expired = Date.now() + 2*60*1000 // 2menit
    try {
        const user = await Users.findAll({
            where:{
                nohp:req.body.nohp
            }
        });
        const nohp = user[0].nohp

        await Otp.create({
            nohp:nohp,
            code:code,
            expired:expired
        })
        const otpToken = jwt.sign({nohp}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn : '10m'
        });
         res.cookie('otpToken', otpToken, {
            httpOnly:true,
            maxAge: 10 * 60 * 1000
        });
        const a = 'asas'
        sendOTP(phoneNumberFormatter(nohp.toString()), code.toString())
        res.status(200).send({otpToken});
    } catch (error) {
        res.status(404).json({msg:"no handphone tidak terdaftar"})
        // res.sendStatus(403)
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id
    await Users.update({refresh_token:null},{where:{id:userId}})
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}
