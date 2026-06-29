import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        throw new ApiErrors(400, "Playlist name is required");
    }

    // Create playlist
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id,  // assuming JWT middleware sets req.user
        videos: []             // default empty
    });

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});


const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if (!userId) {
        throw new ApiErrors(400, "User ID is required");
    }
    if (!isValidObjectId(userId)) {
        throw new ApiErrors(400, "Invalid user ID");
    }

    const playlists = await Playlist.find({ owner: userId }).populate({
        path: "videos",
        populate: {
            path: "owner",
            select: "username fullName avatar"
        }
    });

    return res.status(200).json({ message: "Playlist fetched successfully", data: playlists });
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    if (!playlistId) {
       throw new ApiErrors(400, "Playlist ID is required");
    }
    if (!isValidObjectId(playlistId)) {
        throw new ApiErrors(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId).populate({
        path: "videos",
        populate: {
            path: "owner",
            select: "username fullName avatar"
        }
    });
    if (!playlist) {
        throw new ApiErrors(404, "Playlist not found");
    }
    return res.status(200).json({ message: "Playlist found", data: playlist });
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    if (!playlistId) {
        throw new ApiErrors(400, "Playlist ID is required");
    }
    if (!isValidObjectId(playlistId)) {
        throw new ApiErrors(400, "Invalid playlist ID");
    }
    if (!videoId) {
        throw new ApiErrors(400, "Video ID is required");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiErrors(400, "Invalid video ID");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
           $addToSet: {
             videos: videoId
           }
        },
        { new: true }
    );
    if (!playlist) {
        throw new ApiErrors(404, "Playlist not found");
    }
    return res.status(200).json({ message: "Video added successfully", data: playlist });
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    if (!playlistId) {
        throw new ApiErrors(400, "Playlist ID is required");
    }
    if (!isValidObjectId(playlistId)) {
        throw new ApiErrors(400, "Invalid playlist ID");
    }
    if (!videoId) {
        throw new ApiErrors(400, "Video ID is required");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiErrors(400, "Invalid video ID");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
           $pull: {
             videos: videoId
           }
        },
        { new: true }
    );
    if (!playlist) {
        throw new ApiErrors(404, "Playlist not found");
    }
    return res.status(200).json({ message: "Video removed successfully", data: playlist });
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    if (!playlistId) {
        throw new ApiErrors(400, "Playlist ID is required");
    }
    if (!isValidObjectId(playlistId)) {
        throw new ApiErrors(400, "Invalid playlist ID");
    }
    const deletion = await Playlist.findByIdAndDelete(playlistId);
    if (!deletion) {
        throw new ApiErrors(404, "Playlist not found");
    }
    return res.status(200).json({ message: "Playlist deleted successfully", data: deletion });
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    const {name, description} = req.body;
    if (!playlistId) {
        throw new ApiErrors(400, "Playlist ID is required");
    }
    if (!isValidObjectId(playlistId)) {
        throw new ApiErrors(400, "Invalid playlist ID");
    }
    const update = await Playlist.findByIdAndUpdate(playlistId, {
        name,
        description,
        owner: req.user?._id
    }, { new: true });

    if (!update) {
        throw new ApiErrors(404, "Playlist not found");
    }
    return res.status(200).json({ message: "Playlist updated successfully", data: update });
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}