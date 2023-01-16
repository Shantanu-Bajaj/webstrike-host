import express from "express";
import con from "../db.js";
import userAuthentication from "../middlewares/userAuthentication.js";
import jwt from "jsonwebtoken";
import {create} from "ipfs-http-client"
import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK('02e58c704c7082d34583', '64cfd2d446b856888c1a819f318f91a77a3b2944e9ee70d1b7a7d4e1f2266034');
const ipfs = create({
  host: "127.0.0.1",
  port: 5001,
  protocol: "http",
});

const userRouter = express.Router();
userRouter.get("/register", (req, res) => {
  res.render("register");
});

userRouter.get("/login", (req, res) => {
  res.render("login");
});

userRouter.post("/register", (req, res) => {
  var sqll = "SELECT email FROM final_users WHERE email='" + req.body.email + "'";
  con.query(sqll, function (err, result) {
    if (err) throw err;
    if (!result.length) {
      if (req.body.password.length < 6) {
        res
          .status(401)
          .send({ err: "Password length should be at least 6 characters" });
      } else {
        var sql =
          "INSERT INTO final_users (name, email, password, phone) VALUES ('" +
          req.body.name +
          "','" +
          req.body.email +
          "','" +
          req.body.password +
          "','" +
          req.body.phone +
          "')";
        con.query(sql, function (err, results) {
          if (err) throw err;
          res.status(200).send({
            message: "success",
            data: {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              phone: req.body.phone,
            },
          });
        });
      }
    } else {
      res.status(401).send({ err: "Email already exists" });
    }
  });
});

userRouter.post("/login", (req, res) => {
  if (req.body.email && req.body.password) {
    var sql = "SELECT * FROM final_users WHERE email = '" + req.body.email + "' AND password = '" + req.body.password + "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length) {
        let userToken = jwt.sign({ data: result[0] },process.env.USER_SECRET_KEY,{ expiresIn: 604800 });
        var sql1 ="INSERT INTO final_usertoken (email, token) values ('" +req.body.email +"', '" +userToken +"')";
        con.query(sql1, function (err, result) {
          if (err) throw err;
        });
        res.cookie('access_token', userToken,{
          httpOnly: true
        }).status(200).send({message: "success",token: userToken, userid: result[0].id,name: result[0].name,email: result[0].email,phone: result[0].phone,});
      } else res.status(401).send({ err: "Invalid Credentials" });
    });
  } else {
    res.status(400).send({ err: "Credentials missing" });
  }
});

userRouter.get("/get", userAuthentication, (req, res) => {
  res.status(200).send({
    data: {
      user_id: req.decoded.data.id,
      name: req.decoded.data.name,
      email: req.decoded.data.email,
      phone: req.decoded.data.phone,
    },
    iat: req.decoded.iat,
    exp: req.decoded.exp,
  });
})

userRouter.get("/dashboard", userAuthentication,(req, res) => {
  res.render("dashboard")
});

userRouter.get("/projects/all", userAuthentication,(req,res)=>{
  var sql = "SELECT * FROM projects where email='" + req.decoded.data.email + "'";
  con.query(sql,function(err,result){
    if(err) throw err;
    res.status(200).send({data:result})
  })
})

userRouter.get("/projects/new",userAuthentication, (req,res)=>{
  res.render('newProject')
})

userRouter.post("/projects/upload",userAuthentication, async (req, res) => {
  // console.log(req.body.project_name);
  let files = req.files;
  var files_to_upload = [];
  const cids = []
  const paths = []
  let file_size = 0;
  files.forEach(async function (file) {
    // console.log(file)
    file_size += file.size
    files_to_upload.push({
      content:file.buffer,
      path:  file.fieldname
    })
  });
  console.log(file_size);
  for await (const results of ipfs.addAll(files_to_upload)) {
    cids.push(results.cid)
    paths.push(results.path)
  }
  var cid = cids[cids.length-1].toString();
  var main_path = paths[paths.length-1]
  //pin file to pinata
    //pinata
    const options = {
      pinataMetadata: {
          name: main_path,
      }
    };
    pinata.pinByHash(cid.toString(), options).then((result) => {
      
    }).catch((err) => {
       
    });

  var sql = "INSERT INTO projects(email, name, size, hash) values('" + req.decoded.data.email + "','" + req.body.project_name + "','" + file_size + "','" + cid + "')";
  con.query(sql,function(err,result){
    if(err) throw err;
    res.status(200).send({ message: "success", "cid": cid });
  }) 
});

userRouter.get("/logout", userAuthentication, (req, res) => {
  res.clearCookie('access_token')
  var sql =
    "DELETE FROM final_usertoken WHERE email='" + req.decoded.data.email + "'";
  con.query(sql, function (err, results) {
    if (err) throw err;
    res.status(200).send({ message: "Logged out" });
  });
});

export default userRouter;
