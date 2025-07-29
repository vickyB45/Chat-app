import express from 'express';
import { handleAcceptFriendRequest, handleGetFriendRequest, handleGetMyFriends, handleGetOutgoingFriendRequests, handleGetRecommendedUsers, handleSendFriendRequest } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Apply the protect middleware to all routes in this router

router.get("/",handleGetRecommendedUsers);
router.get("/friends",handleGetMyFriends);

router.post("/friends-request/:id", handleSendFriendRequest); 
router.put("/friends-request/:id/accept", handleAcceptFriendRequest); 

router.put("/friends-requests", handleGetFriendRequest); 
router.put("/outgoing-friend-requests", handleGetOutgoingFriendRequests); 

export default router;