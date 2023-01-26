import { db } from "../connect.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//S-1.1 Registering  New User
export const register = (req,res)=>{
    //CHECK IF USER EXIST
    const q = "SELECT * FROM users WHERE username = ?"

    db.query(q,[req.body.username], (err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("User already Exist")

        //CREATE NEW USER
        //Hash the Password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword  = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)"

        const values = [req.body.username, req.body.email, hashedPassword, req.body.name]

        db.query(q,[values], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("User has been Created")
        })
    })
    
}


//S1.2 Login Method
export const login = (req,res)=>{

    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json("User Not Found !");

        const checkPassword = bcrypt.compareSync(req.body.password,data[0].password);
        if(!checkPassword) return res.status(400).json("Wrong Password or Username!");

        const token = jwt.sign({id:data[0].id}, "secretkey"); //for example to delete particular post we will check that user id

        const {password, ...others} = data[0]; //others will store everything except password and we will pass it as cookie
        //Random Website cannot access our cookie so we use this
        res.cookie("accessToken",token,{
            httpOnly : true,
        }).status(200).json(others) //this will generate one accessToken cookie and when we decrypt this using this we can reach or previous details and all details this cookie will do everything
    })

}


//Logout Method
export const logout = (req,res)=>{
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
    }).status(200).json("User has been Logged Out") //our react application port is different and our backend api port number , they are not the same
};
