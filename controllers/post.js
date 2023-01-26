import { db } from "../connect.js"
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";


export const getPosts = (req,res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in !")

    //Validate this token cause it expires
    jwt.verify(token, "secretkey", (err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!")

        //In our user's timeline he we only see his friends posts
        //Using Join we fetch users as all well as posts JOIN will find common record , but if we want ours as well use LEFT JOIN
        const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
        ORDER BY p.createdAt DESC`;
    
        // ? = follower user id should be our id stored as cookie named accessToken in our pc i.e userInfo.id by jwt
        // to see our post as well we add one more userId

        
        db.query(q,[userInfo.id,userInfo.id],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        })

    })

}

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
      const values = [
        req.body.desc,
        req.body.img,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id,
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been created.");
      });
    });
  };