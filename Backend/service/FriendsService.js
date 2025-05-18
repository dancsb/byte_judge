'use strict';
const Friend = require('../models/Friend');
var utils = require('../utils/writer.js');
const User = require('../models/User');


/**
 * Accept friend request
 * Accept a pending friend request from specific user
 *
 * userId String ID of the user whose friend request to accept
 * returns Friend
 **/
exports.acceptFriendRequest = function(FrienduserId, userId) {
  return new Promise(async function(resolve, reject) {
    try {
      // Find the friend request where the sent field matches the userId and received field matches the currentUserId
      const friendRequest = await Friend.findOneAndUpdate(
        { sent: FrienduserId, received: userId },
        { accepted: true },
        { new: true }
      );

      if (!friendRequest) {
        return reject(utils.respondWithCode(404, { message: 'Friend request not found' }));
      }

      resolve({
        message: 'Action succesful',
      });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Remove friend
 * Remove a user from friends list
 *
 * userId String ID of the friend to remove
 * returns inline_response_200_4
 **/
exports.deleteFriend = function(FrienduserId , userId) {
  return new Promise(async function(resolve, reject) {
      try {
        // Find and delete the friend relationship
        const deletedFriend = await Friend.findOneAndDelete({
          $or: [
            { sent: userId, received: FrienduserId, accepted: true},
            { sent: FrienduserId, received: userId, accepted: true }
          ]
        });
  
        if (!deletedFriend) {
          return reject(utils.respondWithCode(404, { message: 'Friend not found' }));
        }
  
        resolve({
          message: 'Friend removed successfully'
        });
      } catch (err) {
        reject(utils.respondWithCode(500, { message: err.message }));
      }
    });
}


/**
 * Get friend list
 * Get list of all confirmed friends for the authenticated user
 *
 * returns List
 **/
exports.getFriendList = function(userId) {
  return new Promise(async function(resolve, reject) {
    try {
      // Find all friends where the user is either the sender or receiver and the friend request has been accepted
      const friends = await Friend.find({
        $or: [
          { sent: userId, accepted: true },
          { received: userId, accepted: true }
        ]
      });

      if (!friends || friends.length === 0) {
        return resolve({ users: [] });
      }

      // Extract the IDs of the users who are friends
      const friendIds = friends.map(friend => {
        if (friend.sent == userId) {
          return friend.received;
        } else {
          return friend.sent;
        }
      });

      // Find the user details for the friend IDs
      const users = await User.find({ _id: { $in: friendIds } })

      // Format the response to match the specified structure
      const formattedUsers = users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }));

      resolve({ users: formattedUsers });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Get incoming friend requests
 * Get list of users who sent friend requests to the authenticated user
 *
 * returns UserList
 **/
exports.getFriendRequestsIngoing = function(userId) {
  return new Promise(async function(resolve, reject) {
    try {
      // Find all friend requests sent by the user
      const friendRequests = await Friend.find({ received: userId });
      
      const  filteredFriends = friendRequests.filter(request => request.accepted === false);

      if (!filteredFriends || filteredFriends.length === 0) {
        return resolve({ users: [] });
      }

      // Extract the IDs of the users who received the friend requests
      const receivedUserIds = filteredFriends.map(request => request.sent);

      // Find the user details for the received user IDs
      const users = await User.find({ _id: { $in: receivedUserIds } })

      const formattedUsers = users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }));

      resolve({ users : formattedUsers });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Get incoming friend requests
 * Get list of users who is recived friend requests from the authenticated user
 *
 * returns UserList
 **/
exports.getFriendRequestsOutgoing = function(userId) {
  return new Promise(async function(resolve, reject) {
    try {
      // Find all friend requests sent by the user
      const friendRequests = await Friend.find({ sent: userId });
      
      const  filteredFriends = friendRequests.filter(request => request.accepted === false);

      if (!filteredFriends || filteredFriends.length === 0) {
        return resolve({ users: [] });
      }

      // Extract the IDs of the users who received the friend requests
      const receivedUserIds = filteredFriends.map(request => request.received);

      // Find the user details for the received user IDs
      const users = await User.find({ _id: { $in: receivedUserIds } });

      const formattedUsers = users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }));  

      resolve({ users : formattedUsers });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Reject friend request
 * Reject a pending friend request from specific user
 *
 * userId String ID of the user whose friend request to reject
 * returns Friend
 **/
exports.rejectFriendRequest = function(FrienduserId,userId) {
  return new Promise(async function(resolve, reject) {
    try {
      // Find the friend request where the sent field matches the userId and received field matches the currentUserId
      const friendRequest = await Friend.findOneAndDelete(
        { sent: FrienduserId, received: userId, accepted: false }
      );

      if (!friendRequest) {
        return reject(utils.respondWithCode(404, { message: 'Friend request not found' }));
      }

      resolve({
        message: 'Action succesful',
      });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Send friend request
 * Send a friend request to another user
 *
 * userId String ID of the user to send friend request to
 * returns FriendRequest
 **/
exports.sendFriendRequest = function(FrienduserId, userId) {
  return new Promise(async function(resolve, reject) {
    try {

      // Check if a friend request already exists
      const existingRequest = await Friend.findOne({ sent: userId, received: FrienduserId });
      if (existingRequest) {
        return reject(utils.respondWithCode(409, { message: 'Friend request already sent' }));
      }

      // Check if a friend request has already been received from the other user
      const receivedRequest = await Friend.findOne({ sent: FrienduserId, received: userId });
      if (receivedRequest) {
        return reject(utils.respondWithCode(409, { message: 'You have already received a friend request from this user' }));
      }

      // Create a new friend request
      const newFriendRequest = new Friend({
        sent: userId,
        received: FrienduserId,
        accepted: false
      });

      const savedFriendRequest = await newFriendRequest.save();

      resolve({
        message: 'Friend request sent successfully'
      });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}