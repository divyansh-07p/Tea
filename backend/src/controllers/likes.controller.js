import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/likes.model.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiErrors(400, "Invalid video ID");
    }
    const userId = req.user._id;
    const existingLike = await Like.findOne({video : videoId , user: userId});
    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Video unliked successfully"));
    }
    const newLike = await Like.create({
      video : videoId, 
      user: userId,
    });
    res.status(200).json(new ApiResponse(200, { liked: true, like: newLike }, "Video liked successfully"));
})


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!isValidObjectId(commentId)) {
        throw new ApiErrors(400, "Invalid comment ID");
    }
    const userId = req.user._id;
    const existingLike = await Like.findOne({comment : commentId , user: userId});
    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Comment unliked successfully"));
    }
    const newLike = await Like.create({comment : commentId, user: userId});
    res.status(200).json(new ApiResponse(200, { liked: true, like: newLike }, "Comment liked successfully"));
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)) {
        throw new ApiErrors(400, "Invalid tweet ID");
    }
    const userId = req.user._id;
    const existingLike = await Like.findOne({tweet : tweetId , user: userId});
    if(existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Tweet unliked successfully"));
    }
    const newLike = await Like.create({tweet : tweetId, user: userId});
    res.status(200).json(new ApiResponse(200, { liked: true, like: newLike }, "Tweet liked successfully"));
})

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!isValidObjectId(userId)) {
    throw new ApiErrors(400, "Invalid user ID");
  }

  const likedVideos = await Like.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId), video: { $exists: true, $ne: null } }
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideo"
      }
    },
    {
      $unwind: "$likedVideo"
    },
    {
      $lookup: {
        from: "users",
        localField: "likedVideo.owner",
        foreignField: "_id",
        as: "ownerDetails"
      }
    },
    {
      $unwind: "$ownerDetails"
    },
    {
      $project: {
        _id: 0,
        likedVideoId: "$likedVideo._id",
        videoFile: "$likedVideo.videoFile",
        thumbnail: "$likedVideo.thumbnail",
        title: "$likedVideo.title",
        description: "$likedVideo.description",
        duration: "$likedVideo.duration",
        views: "$likedVideo.views",
        isPublished: "$likedVideo.isPublished",
        createdAt: "$likedVideo.createdAt",
        updatedAt: "$likedVideo.updatedAt",
        owner: {
          _id: "$ownerDetails._id",
          username: "$ownerDetails.username",
          fullName: "$ownerDetails.fullName",
          avatar: "$ownerDetails.avatar"
        }
      }
    }
  ]);

  res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});




export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}