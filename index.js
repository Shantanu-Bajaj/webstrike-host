import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import express from "express";
import {engine} from "express-handlebars";
import con from "./db.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const port = process.env.PORT || 80;
const host = process.env.aws_host;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())
app.use(multer().any());
app.use(cors());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use("/user", userRouter);

app.get("/", (req,res) => {
  res.render('home')
})

app.get("/contact",(req,res)=>{
  res.render('contact')
})

app.post("/contact",(req,res)=>{
  var sql = "INSERT INTO contactus(name, email, subject, message) values('" + req.body.name + "','" + req.body.email + "','" + req.body.subject + "','" + req.body.message + "')";
  con.query(sql,function(err,result){
    if(err) throw err
    res.status(200).send({message:"Thank you for contacting us! We will reach out ASAP", data:result[0]})
  })
})

app.listen(port,host,() => {
  console.log(`listening on port ${port}`);
});


// API KEY -- 02e58c704c7082d34583
// API SECRET -- 64cfd2d446b856888c1a819f318f91a77a3b2944e9ee70d1b7a7d4e1f2266034
// JWT -- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5Zjk2NjEwNS0zNjU1LTQ1ZDQtOGE3Ni1hZjEyNDEyMzAxNmUiLCJlbWFpbCI6InNoYW50YW51YmFqYWowNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDJlNThjNzA0YzcwODJkMzQ1ODMiLCJzY29wZWRLZXlTZWNyZXQiOiI2NGNmZDJkNDQ2Yjg1Njg4OGMxYTgxOWYzMThmOTFhNzdhM2IyOTQ0ZTllZTcwZDFiN2E3ZDRlMWYyMjY2MDM0IiwiaWF0IjoxNjcyMTQwMTkxfQ.-5q7iJC3uQhT76V4_TuvfSX-XL0F76II6pL10hR8dHQ

// API Key: 02e58c704c7082d34583
//  API Secret: 64cfd2d446b856888c1a819f318f91a77a3b2944e9ee70d1b7a7d4e1f2266034
//  JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5Zjk2NjEwNS0zNjU1LTQ1ZDQtOGE3Ni1hZjEyNDEyMzAxNmUiLCJlbWFpbCI6InNoYW50YW51YmFqYWowNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDJlNThjNzA0YzcwODJkMzQ1ODMiLCJzY29wZWRLZXlTZWNyZXQiOiI2NGNmZDJkNDQ2Yjg1Njg4OGMxYTgxOWYzMThmOTFhNzdhM2IyOTQ0ZTllZTcwZDFiN2E3ZDRlMWYyMjY2MDM0IiwiaWF0IjoxNjcyMTQwMTkxfQ.-5q7iJC3uQhT76V4_TuvfSX-XL0F76II6pL10hR8dHQ