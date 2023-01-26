import  Express, { json }  from "express";
const app = Express()
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

//MiddleWare
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials",true)
    next()
})
app.use(Express.json())
app.use(cors({
    origin: "http://localhost:3000"
})) //it will add local host 3000 client url
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/likes",likeRoutes);

app.listen(8800, ()=>{
    console.log("API is Working")
})