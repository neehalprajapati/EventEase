const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer")
dotenv.config();


exports.register = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    serviceType,
    location,
    description,
  } = req.body;
  try {
    let user;
    if (role === "customer") {
      user = await new UserModel({
        username,
        email,
        password,
        role,
        
      });
      await user.save();
      return res.send("signup successfully");
    } else if (role === "service") {
      user = await new UserModel({
        username,
        email,
        password,
        role,
        serviceType,
        location,
        description,
        
      });
      await user.save();
      // Generate email verification token
      

      // Send verification email
      
      return res.send(
        "Signup successful"
      );
    }
  } catch (err) {
    // Fix error handling here
    return res.status(500).send("Error registering user: " + err.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.send("INCORRECT CREDENTIALS");
    }
    // if (!user.isVerified) {
    //     return res.status(400).send('Please verify your email before logging in.');
    //   }
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.send("INCORRECT PASSWORD");
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.secret_key,
      { expiresIn: "12h" }
    );
    res.cookie(user._id, token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30),
      httpOnly: true,
      sameSite: "lax",
    });
    return res.send({ message: "login successful", token: token });
  } catch (err) {
    return res.status(400).send("err");
  }
};
// exports.verifyEmail = async (req, res) => {
//     const { token } = req.query;
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
//       const user = await UserModel.findById(decoded.userId);
//       if (!user) {
//         return res.status(404).send('User not found.');
//       }
  
//       if (user.isVerified) {
//         return res.status(400).send('Email already verified.');
//       }
  
//       user.isVerified = true;
//       await user.save();
  
//       return res.redirect('http://localhost:5173/login');
//     } catch (err) {
//       console.error(err);
//       return res.status(400).send('Invalid or expired token.');
//     }
//   };
