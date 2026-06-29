import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/sunbcriptions.model.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {id} = req.params; // channelId
    const userId = req.user?._id;

    if (!id || !isValidObjectId(id)) {
        throw new ApiErrors(400, "Invalid channel ID");
    }

    // Verify channel exists
    const channel = await User.findById(id);
    if (!channel) {
        throw new ApiErrors(404, "Channel does not exist");
    }

    const existingSub = await Subscription.findOne({
        subscriber: userId,
        channel: id
    });

    if (existingSub) {
        await Subscription.findByIdAndDelete(existingSub._id);
        return res.status(200).json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"));
    } else {
        const subscribe = await Subscription.create({
            subscriber: userId,
            channel: id,
        });
        return res.status(200).json(new ApiResponse(200, { subscribed: true, subscription: subscribe }, "Subscribed successfully"));
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiErrors(400, "Please register and login");
    }
    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiErrors(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: { channel: new mongoose.Types.ObjectId(channelId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },
        {
            $unwind: "$subscriberDetails"
        },
        {
            $project: {
                _id: 0,
                subscriber: 1,
                channel: 1,
                subscriberDetails: {
                    _id: "$subscriberDetails._id",
                    username: "$subscriberDetails.username",
                    email: "$subscriberDetails.email",
                    avatar: "$subscriberDetails.avatar"
                }
            }
        }
    ]);

    return res.status(200).json({
        message: "Subscribers fetched successfully",
        data: subscribers
    });
});


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { id } = req.params; // subscriberId
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiErrors(400, "Please register and login");
    }
    if (!id || !isValidObjectId(id)) {
        throw new ApiErrors(400, "Invalid subscriber ID");
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "users",              // joining with users collection
                localField: "channel",      // channel field in Subscription
                foreignField: "_id",        // _id in users
                as: "channelDetails"
            }
        },
        {
            $unwind: "$channelDetails"     // flatten array from lookup
        },
        {
            $project: {
                _id: 0,
                channelId: "$channelDetails._id",
                channelName: "$channelDetails.username",
                email: "$channelDetails.email",
                avatar: "$channelDetails.avatar",
                createdAt: "$channelDetails.createdAt"
            }
        }
    ]);

    return res.status(200).json({
        message: "Subscribed channels fetched successfully",
        data: subscribedChannels
    });
});


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}