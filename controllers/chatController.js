import { generateStreamToken } from "../config/stream.js";


export const handleGetStreamToken = (req, res) => {
    try{
        const token = generateStreamToken(req.userId);
        console.log(token)
    }
    catch(error){
        console.error("Error in handleGetStreamToken:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}