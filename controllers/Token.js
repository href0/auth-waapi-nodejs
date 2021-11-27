import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const Token = async (req, res) => {
    try {
        const otpToken = req.cookies.otpToken;
        if(!otpToken) return res.sendStatus(401);
        res.json({otpToken})
    } catch (error) {
        console.log(error)
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const name = user[0].name
            const nohp = user[0].nohp
            const accessToken = jwt.sign({nohp, name}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn : '15s'
            })
            res.json({accessToken})
        })

    } catch (error) {
        console.log(error)
    }
}