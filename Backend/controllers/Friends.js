'use strict';

var utils = require('../utils/writer.js');
var Friends = require('../service/FriendsService');
var verifyToken = require('../utils/verifyToken.js');


module.exports.acceptFriendRequest = function acceptFriendRequest (req, res, next, userId) {
  const token_userId = verifyToken(req, res);
  if (!token_userId) return;
  Friends.acceptFriendRequest(userId, token_userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteFriend = function deleteFriend (req, res, next, userId) {
  const token_userId = verifyToken(req, res);
  if (!token_userId) return;
  
  Friends.deleteFriend(userId , token_userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getFriendList = function getFriendList (req, res, next) {
  const token_userId = verifyToken(req, res);
  if (!token_userId) return;
  Friends.getFriendList(token_userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getFriendRequestsIngoing = function getFriendRequestsIngoing (req, res, next) {
  const token_userId = verifyToken(req, res);
  if (!token_userId) return;

  Friends.getFriendRequestsIngoing(token_userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getFriendRequestsOutgoing = function getFriendRequestsOutgoing (req, res, next) {
  const token_userId = verifyToken(req, res);
  if (!token_userId) return;
  Friends.getFriendRequestsOutgoing(token_userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.rejectFriendRequest = function rejectFriendRequest (req, res, next, userId) {
  const token_userId = verifyToken(req, res);
  if (!token_userId) return;
  Friends.rejectFriendRequest(userId, token_userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.sendFriendRequest = function sendFriendRequest (req, res, next, userId) {
  const token_userId = verifyToken(req, res);
  if (!token_userId) return;

  Friends.sendFriendRequest(userId,token_userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
