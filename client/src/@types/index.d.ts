export interface NotOk {
  error: string;
}

export interface Organiser {
  _id: string;
  email: string;
  username: string;
}

export interface Participant {
  _id: string;
  email: string;
  username: string;
}

export interface Sports_activity {
  _id: string;
  organiser: Organiser;
  participants: Participant[];
  activity: string;
  duration: string;
  date: string;
  createdAt: string
}

export interface User {
  _id: string;
  email: string;
  username: string;
  createdAt: string;
  profile_pic: string;
  sports_activities: Sports_activity[];
}

export type Users = User[];

interface Activity {
  organiser: string,
  activity: string,
  date: string
}

type Activities = Activity[]

type DataList = Activities[]

type DataListList = DataList[]

type Data = number[][]

interface TestUser {
  username: string,
  sports_activities: Activities
}

type UserInfoArray = { yLabel: string, activityList: DataList }[]
