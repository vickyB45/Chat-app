import dotenv from "dotenv";
dotenv.config(); // ✅ sabse upar rakho

import { StreamChat } from "stream-chat";

 const apiKey = process.env.STREAM_API_KEY
 const apiSecret = process.env.STREAM_API_SECRET

 if(!apiKey || !apiSecret){
    console.error("Strem API key or secret is not set in environment variables.");
 }
    const streamClient = StreamChat.getInstance(apiKey, apiSecret);

 export const upsateStreamUser = async (userData)=>{
    try{
        await streamClient.upsertUsers([userData])
        return userData;    
    }
    catch(error){
        console.error("Error updating Stream user:", error);
    }
 }


//  do it letter 
 export const generateStreamToken =  (userId)=>{
   try{
      const userIdStr = userId.toString();
      return streamClient.createToken(userIdStr); // ✅ userId ko string mein convert karo
   }
   catch(error){
       console.error("Error generating Stream token:", error);
   }
 }