const FriendRequest = require("../models/FriendRequest");
const User = require("../models/user");

exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user_id;
    const receiverId = req.params.userId;

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "Cannot friend yourself",
      });
    }

    const existing = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (existing) {
      return res.status(409).json({
        message: "Request already exists",
      });
    }

    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.user_id,
      status: "pending",
    }).populate("sender");

    res.json(requests);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(
      req.params.requestId
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(
      request.sender,
      {
        $addToSet: {
          friends: request.receiver,
        },
      }
    );

    await User.findByIdAndUpdate(
      request.receiver,
      {
        $addToSet: {
          friends: request.sender,
        },
      }
    );

    res.json({
      message: "Friend request accepted",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.declineRequest = async (req, res) => {
  try {
    await FriendRequest.findByIdAndUpdate(
      req.params.requestId,
      {
        status: "declined",
      }
    );

    res.json({
      message: "Friend request declined",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const userId = req.user_id;
    const friendId = req.params.friendId;

    await User.findByIdAndUpdate(userId, {
      $pull: {
        friends: friendId,
      },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: {
        friends: userId,
      },
    });

    res.json({
      message: "Friend removed",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};