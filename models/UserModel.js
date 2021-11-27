import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    name:{
        type:DataTypes.STRING
    },
    nohp:{
        type:DataTypes.STRING
    },
    refresh_token:{
        type:DataTypes.TEXT
    }
}, {
    freezeTableName:true
})

export default Users;