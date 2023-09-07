import { activitiesModel } from "../models/sports_activities.js";
import { UserModel } from "../models/user.js";

const findAllActivities = async (req, res) => {
  try {
    const result = await activitiesModel
      .find()
      .populate({
        path: "organiser",
        select: ["username", "email", "participant"],
      })
      .populate({ path: "participants", select: ["_id", "email", "username"] });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong..." });
  }
};

const createActivity = async (req, res) => {
  console.log(req.body);
  const testing = {
    organiser: req.body.organiser,
    participants: req.body.participants, //remove split since participants is already an array
    activity: req.body.activity,
    duration: req.body.duration,
    date: req.body.date,
  };
  console.log(testing);
  try {
    //create new activity
    const newActivity = new activitiesModel(testing);
    const createdActivity = await newActivity.save();
    //update user document to include new activity
    const user = await UserModel.findByIdAndUpdate(req.body.organiser, { $push: { sports_activities: createdActivity._id } }).select("-password")
    //sending back the new activity, but also the updated user to set state
    res.status(200).json({ activity: createdActivity, user: user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Unknown error occurred" });
  }
};

export { findAllActivities, createActivity };
