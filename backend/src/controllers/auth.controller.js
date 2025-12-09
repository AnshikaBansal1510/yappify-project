import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

// user -> signup button -> trigger request -> request to /api/auth/signup -> create user in database
// when user created -> generated JWT -> send JWT in cookies -> success (account created and authenticated correctly)
export async function signup(req, res){
  const { email, password, fullName } = req.body

  try {

    if(!email || !password || !fullName){

      return res.status(400).json({ message: "All fields are required" });
    }

    if(password.length < 6){

      return res.status(400).json({ message: "Password must be of atleast 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if(existingUser){

      return res.status(400).json({ message: "Email already exists, please use a different one"});
    }

    // generate a number between 1-100
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar-placeholder.iran.liara.run/${idx}.png`;

    const newUser = await User.create({
      email, 
      fullName,
      password,
      profilePic: randomAvatar
    })

    // create user in stream as well

    // payload ... secretKey
    const token = jwt.sign(
      {
        userId: newUser._id,         // to identify who own this token generated
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d"
      }  
    )

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,    // ms
      httpOnly: true,                     // prevent XSS attacks
      sameSite: "strict",                 // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production"
    })

    res.status(201).json({ 
      success: true,
      user: newUser
    })

  } catch (error) {

    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res){
  res.send("Login Route")
}

export function logout(req, res){
  res.send("Logout Route")
}