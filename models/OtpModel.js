import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Otp = db.define('otp', {
    nohp:{
        type:DataTypes.STRING
    },
    code:{
        type:DataTypes.STRING
    },
    expired:{
        type:DataTypes.STRING
    }
}, {
    freezeTableName:true
})

export default Otp;