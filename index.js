import  Express, { json }  from "express";
const app = Express()
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoute from "./routes/relationships.js";
import storiesRoute from "./routes/stories.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";


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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })
  
const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req,res)=>{
    const file = req.file;
    res.status(200).json(file.filename)
})

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/likes",likeRoutes);
app.use("/api/relationships",relationshipRoute);
app.use("/api/stories",storiesRoute)


app.listen(8800, ()=>{
    console.log("API is Working")
})