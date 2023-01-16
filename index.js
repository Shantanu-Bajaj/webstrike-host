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

app.listen(port,() => {
  console.log(`listening on port ${port}`);
});
