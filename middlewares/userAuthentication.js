import jwt from "jsonwebtoken";
import con from "../db.js"

const userAuthentication = function (req, res, next) {
    // if (!req.headers.hasOwnProperty("authorization")) {
    //   // res.status(401).send({err:"There was some error"});
    //   res.status(401).send({ err: "Please login first" });
    // }
    // let userToken = req.headers.authorization;
    const userToken = req.cookies.access_token;
    if(!userToken)
    {
      res.redirect('/user/login')
    }
    // userToken = userToken.split(" ")[1];
    var sql = "SELECT token FROM final_usertoken where token='" + userToken + "'";
    con.query(sql, function (err, result) {
      if (result.length){
        // console.log(result);
        // jwt.verify(userToken, process.env.USER_SECRET_KEY, (err, decoded) => {
        //   if (err) res.status(401).send({ error: "Unauthorized" });
        //   req.decoded = decoded;
        // });
        jwt.verify(userToken,process.env.USER_SECRET_KEY,(err, decoded) =>{
          if (err) res.status(403).send({ error: "Unauthorized" });
          req.decoded = decoded;
        })
      }
      // else res.status(401).send({ error: "Please Login First" });
      next();
    });
  };

  export default userAuthentication;