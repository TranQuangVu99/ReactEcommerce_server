const router = require("express").Router();
const User = require("../models/user");
const verifyToken = require('../middlewares/verify-token');
const jwt = require("jsonwebtoken");

/* Signup Route*/
router.post("/auth/signup", async (req, res) => {
  if (!req.body.namelogin || !req.body.password ) {

    res.json({ success: false, message: "Please enter email or password" });
  } else {
    try {
      let newUser = new User(req.body);
      await newUser.save();
      let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
        expiresIn: 604800, // 1 week
      });
      res.json({
        success: true,
        token: token,
        message: "Successfully create a new user",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
});

/**Profile Route */
router.get("/auth/user", verifyToken, async (req, res) => {
  try {
    let foundUser =  await User.findOne({ _id: req.decoded._id }).populate('address');
    
    if (foundUser) {
      res.json({
        success: true,
        user: foundUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
/**Update a profile */
router.put('/auth/user',verifyToken, async(req,res)=>{
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id });
    if (foundUser) {
      if(req.body.name){
        foundUser.name = req.body.name
      }
      if(req.body.email){
        foundUser.email = req.body.email
      }
      if(req.body.password){
        foundUser.password = req.body.password
      }
      await foundUser.save()

      res.json({
        success: true,
        message:"Successfully updated"
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
})

/**Login route */
router.post("/auth/login", async (req, res) => {
  try {
    let foundUser = {}
    if(req.body.email){
      foundUser = await User.findOne({ email: req.body.email });
    }
    else{
      if(req.body.namelogin){
        foundUser = await User.findOne({ namelogin: req.body.namelogin });
      }else{
        res.status(403).json({
          success: false,
          message: "Authentication failed, User not found",
        });
      }
    }
    if (!foundUser) {
      res.status(403).json({
        success: false,
        message: "Authentication failed, User not found",
      });
    } else {
      if (foundUser.comparePassword(req.body.password)) {
        let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
          expiresIn: 604800, // one week
        });
        res.json({
            success:true,
            token: token,
            email:foundUser.email,
            username : foundUser.username
        })
      }else{
          res.status(403).json({
              success: false,
              message:"Authentication failed, Wrong password!"
          })
      }
    }
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
      });
  }
});
module.exports = router;
