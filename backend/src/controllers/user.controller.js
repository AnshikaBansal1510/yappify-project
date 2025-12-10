import User from "../models/user.model.js";

export async function getRecommendedUsers(req, res){
  try {
    
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [ 
        { _id: { $ne: currentUserId }}, // exclude current user
        { $id: { $nin: currentUser.friends }},  // exclude current user friends
        { isOnBoarded: true }
      ]
    })

    res.status(200).json(recommendedUsers);

  } catch (error) {
    
    console.log("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res){

  try {
    
    const user = await User.findById(req.user.id).select("friends")
    .populate("friends", "fullName profilePic nativeLanguage learningLanguage")   // populate array of ids to given info

    res.status(200).json(user.friends);
    
  } catch (error) {

    console.error("Error in fetching friends list", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}