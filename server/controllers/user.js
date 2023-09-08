import { activitiesModel } from "../models/sports_activities.js";
import { UserModel } from "../models/user.js";
import { encryptPassword, verifyPassword } from "../utilities/bcrypt.js";
import { imageUpload } from "../utilities/imageManagement.js";
import { generateToken } from "../utilities/jwt.js";

const testResponse = (req, res) => {
  res.send("We have a response!!!!!!");
};

const middleTest = (req, res, next) => {
  {
    console.log("middleware is running");
    next();
  }
};

const findAllUsers = async (request, response) => {
  try {
    const users = await UserModel.find().populate("sports_activities");
    if (users) {
      const forFront = [];
      users.forEach((user) => {
        const userObj = {
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          _id: user._id,
          profile_pic: user.profile_pic,
        };
        if (user.sports_activities) {
          userObj.sports_activities = user.sports_activities;
        }
        forFront.push(userObj);
      });
      response.status(200).json(forFront);
    } else {
      response.status(404).json({ error: "No users found" });
    }
  } catch (e) {
    response.status(500).json({ error: "Something went wrong..." });
  }
};

const findUserByEmail = async (req, res) => {
  const { email } = req.params;
  if (email && email.includes("@")) {
    try {
      const foundUser = await UserModel.findOne({ email: email }).select("-password").populate("sports_activities");
      if (foundUser) {
        const forFront = {
          email: foundUser.email,
          username: foundUser.username,
          _id: foundUser._id,
          createdAt: foundUser.createdAt,
        };
        res.status(200).json(foundUser);
      } else {
        res.status(404).json({ error: "No user found" });
      }
    } catch (e) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(400).json({ error: "valid mail must be included" });
  }
};

const createUser = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    res.status(400).json({ error: "All fields must be filled out" });
    return;
  }
  try {
    const result = await imageUpload(req.file, "profile_pictures");
    const hashedPassword = await encryptPassword(password);
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      username,
      profile_pic: result,
    });
    const createdUser = await newUser.save();
    const forFront = {
      email: createdUser.email,
      username: createdUser.username,
      _id: createdUser._id,
      createdAt: createdUser.createdAt,
      profile_pic: createdUser.profile_pic,
    };
    res.status(200).json(forFront);
  } catch (e) {
    console.log(e);
    e.code === 11000 ? res.status(406).json({ error: "That email is already registered" }) : res.status(500).json({ error: "Unknown error occured" });
  }
};

const updateUser = async (req, res) => {
  console.log(req.file);
  try {
    if (req.file) {
      const newProfilePic = await imageUpload(req.file, "profile_pictures");
      const { password, ...updatedData } = req.body; // Exclude the password from the updatedData object
      const result = await UserModel.findByIdAndUpdate(req.body._id, { ...updatedData, profile_pic: newProfilePic }, { new: true }).select("-password"); // Exclude the password field from the returned document
      res.status(200).json(result);
    } else {
      const { password, ...updatedData } = req.body; // Exclude the password from the updatedData object
      const result = await UserModel.findByIdAndUpdate(req.body._id, updatedData, { new: true }).select("-password"); // Exclude the password field from the returned document
      res.status(200).json(result);
    }
  } catch (e) {
    res.status(500).json({ error: "Something went wrong..." });
  }
};

const findUserById = async (req, res) => {
  const { _id } = req.params;
  if (_id) {
    try {
      const foundUser = await UserModel.findOne({ _id: _id });
      if (foundUser) {
        const forFront = {
          email: foundUser.email,
          username: foundUser.username,
          _id: foundUser._id,
          createdAt: foundUser.createdAt,
        };
        res.status(200).json(forFront);
      } else {
        res.status(404).json({ error: "No participants found" });
      }
    } catch (e) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(400).json({ error: "No participants found" });
  }
};

const updatePassword = async (req, res) => {
  const { password: stringPassword, _id } = req.body;
  try {
    const hashedPassword = await encryptPassword(stringPassword);
    console.log(stringPassword, _id, hashedPassword);
    result = await UserModel.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true });
    res.status(200).json({ message: "password successfully updated!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "No user with that email." });
    }
    const verified = await verifyPassword(password, existingUser.password);
    if (!verified) {
      return res.status(401).json({
        error: "Password doesn't match.",
        verified: verified,
      });
    }
    const token = generateToken(existingUser);
    const forFront = {
      email: existingUser.email,
      _id: existingUser._id,
      username: existingUser.username,
      createdAt: existingUser.createdAt,
      profile_pic: existingUser.profile_pic,
      sports_activities: existingUser.sports_activities
    };
    console.log(forFront);
    res.status(200).json({
      verified: verified,
      token: token,
      user: forFront,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong..." });
  }
};

const getMe = async (req, res) => {
  // res.status(200).json(req.user) // full user, including private data
  try {
    await req.user.populate("sports_activities");
    const forFront = {
      email: req.user.email,
      username: req.user.username,
      _id: req.user._id,
      createdAt: req.user.createdAt,
      profile_pic: req.user.profile_pic,
      sports_activities: req.user.sports_activities
    };
    console.log(forFront)
    res.status(200).json(forFront); // return new object with only chosen properties
  } catch (error) {
    console.log(error)
  }
};

export { testResponse, middleTest, findAllUsers, findUserByEmail, createUser, updateUser, findUserById, updatePassword, login, getMe };
