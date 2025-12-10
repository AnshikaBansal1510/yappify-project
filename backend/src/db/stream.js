import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){

  console.error("Stream API Key or Secret is missing");
}

// communicate with stream application
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {

  try {
    
    await streamClient.upsertUsers([userData]);     // create or update
    return userData;
  } catch (error) {
    
    console.error("Error upserting Stream user: ", error);
  }
}

export const generateStreamToken = (userId) => {
  
  try {
    
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);

  } catch (error) {
    
    console.log("Error generating Stream token:", error.message);
  }
}