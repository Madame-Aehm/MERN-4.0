import { response } from "express";
import { UserModel } from "../models/user.js";

const testResponse = (req, res) => {
  res.send("We have a response!!!!!!");
};

const findAllUsers = async (request, response) => {
  try {
    const users = await UserModel.find();
    if (users) {
      const forFront = [];
      users.forEach((user) =>
        forFront.push({
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          _id: user._id,
        })
      );
      response.status(200).json(forFront);
    } else {
      response.status(404).json({ error: "nothing in collection" });
    }
  } catch (e) {
    response.status(500).json({ error: "Something went wrong..." });
  }
};

const findUserByEmail = async (req, res) => {
  const { email } = req.params;
  if (email && email.includes("@")) {
    try {
      const foundUser = await UserModel.findOne({ email: email });
      if (foundUser) {
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
  // console.log(req.params);
};

export { testResponse, findAllUsers, findUserByEmail };
