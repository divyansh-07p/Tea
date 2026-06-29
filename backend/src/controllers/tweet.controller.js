import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    if(!content)
    {
        throw new ApiErrors(401,"Content is required");
    }
    const tweet = await Tweet.create(
        {
            owner: req.user._id,
            content,
        }
    )
    return res.status(200).json(new ApiResponse(200, tweet, "Tweet created successfully"))
});

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if(!userId || !isValidObjectId(userId))
    {
        throw new ApiErrors(400, "Valid User ID is required");
    }
    const tweets = await Tweet.find({ owner: userId })
        .sort({ createdAt: -1 })
        .populate("owner", "username fullName avatar");

    return res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId)
    {
        throw new ApiErrors(401,"Tweet ID is required");
    }
    const {content} = req.body
    if(!content)
    {
        throw new ApiErrors(401,"Content is required");
    }
    const updateTweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set: {
                content,
            }
        }, { new: true }
    )
    return res.status(200).json(new ApiResponse(200, updateTweet, "Tweet updated successfully"))
});

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId)
    {
        throw new ApiErrors(401,"Tweet ID is required");
    }
    const tweet = await Tweet.findByIdAndDelete(tweetId)
    return res.status(200).json(new ApiResponse(200, [], "Tweet deleted successfully"))
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}