import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  bio: {
    type: String,
    default: ""
  },
  profilePic: {
    type: String,
    default: ""
  },
  nativeLanguage: {
    type: String,
    default: ""
  },
  learningLanguage: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  isOnBoarded: {    // allow whether user can access other pages or not at the moment
    type: Boolean,
    default: false
  },
  friends: [        // stores Ids of friends
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, {timestamps: true});

// pre hook : just before saving user to database -> hash the password
userSchema.pre("save", async function(next){

  if(!this.isModified("password"))    return next();

  try {    
    this.password = await bcrypt.hash(this.password, 10)
    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.model("User", userSchema)

export default User;