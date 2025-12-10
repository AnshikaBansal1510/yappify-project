import { generateStreamToken } from "../db/stream.js";

export async function getStreamToken(req, res){

  try {
    
    // use this token to visit the chat page and call page
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });

  } catch (error) {
    
    console.log("Error in generating Stream Token", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}