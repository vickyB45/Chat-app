import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const handleGetRecommendedUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const currentUser = await User.findById(userId);

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: userId } }, // Exclude the current user
        { _id: { $nin: currentUser.friends } }, // Exclude friends of the current user
        { isOnboarded: true }, // Only include users who are onboarded
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in handleGetRecommendedUsers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handleGetMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("friends")
      .populate("friends", "name email avatar nationality");
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in handleGetMyFriends:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handleSendFriendRequest =  async (req,res)=>{
    try{
        const  myId = req.userId;
        const {id:recipientId} = req.params;

        // Check if the recipientId is valid
        if (myId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }   


        // Check if the recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found." });
        }

        // Check if the recipient is already a friend
        if(recipient.friends.includes(myId)){
            return res.status(400).json({ message: "You are already friends with this user." });
        }
        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        // If a friend request already exists, return an error
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists." });
        }

        // Create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        })

        res.status(201).json({
            message: "Friend request sent successfully.",
            friendRequest,
        });
    }   
catch (error) {
        console.error("Error in handleSendFriendRequest:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const handleAcceptFriendRequest = async (req, res) => {
    try{
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId)

        // Check if the friend request exists
         if(!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
         }

         // Check if the current user is the recipient of the friend request
         if(friendRequest.recipient.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
         }

         friendRequest.status = "accepted";
         await friendRequest.save();

         // Add each other to friends list
         await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: req.userId }
         });    
         await User.findByIdAndUpdate(req.userId, {
            $addToSet: { friends: friendRequest.sender }
         });
         res.status(200).json({ message: "Friend request accepted successfully." });
    }
    catch(error) {
        console.error("Error in handleAcceptFriendRequest:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const handleGetFriendRequest = async (req, res) => {
    try{
        const incomingRequests = await FriendRequest.find({
            recipient: req.userId,
            status: "pending"
        }).populate("sender", "name email avatar nationality")
        
        const acceptedRequests = await FriendRequest.find({
            recipient: req.userId,
            status: "accepted"
        }).populate("sender", "name avatar")

        res.status(200).json({
            incomingRequests,
            acceptedRequests
        });
    }

    catch (error) {
        console.error("Error in handleGetFriendRequest:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const handleGetOutgoingFriendRequests = async (req, res) => {
    try{
        const outgoingRequests = await FriendRequest.find({
            sender: req.userId,
            status: "pending"
        }).populate("recipient", "name email avatar nationality");

        res.status(200).json(outgoingRequests);
    }
    catch (error) {
        console.error("Error in handleGetOutgoingFriendRequests:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}