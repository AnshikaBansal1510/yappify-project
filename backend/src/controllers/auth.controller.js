import { upsertStreamUser } from "../db/stream.js";
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
    try {

      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      })

      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      
      console.log("Error creating Stream user:", error);
    }

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

// user -> send req to /api/auth/login -> check user credentials -> if valid generate tokens
// send token back -> in cookies
export async function login(req, res){
  
  try {
    
    const { email, password } = req.body;

    if(!email || !password){

      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if(!user){

      return res.status(401).json({ message: "Invalid email or password" });  // unauthorized access
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if(!isPasswordCorrect){

      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,         // to identify who own this token generated
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

    res.status(200).json({ 
      success: true,
      user
    })
  } catch (error) {
    
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res){

  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout Successful"});
}

// update profile request with jwt cookies -> validate JWT -> show success/failure
export async function onboard(req, res){
  
  //console.log(req.user);

  try {
    
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){

      return res.status(400).json({ 
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean)   // only give true values
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnBoarded: true,
    }, {new: true})

    if(!updatedUser){

      return res.status(404).json({ message: "User not found" });
    }

    // update user info in stream
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || ""
      })

      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (error) {
      
      console.log("Error updating Stream user during onboarding: ", error.message);
    }

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    
    console.error("Onboarding error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}