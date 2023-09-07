import { Data, DataList, User } from "../@types";


const generateY = (user: User) => {
  const today = new Date();
  const weekStart = new Date(new Date(today.setDate(today.getDate() - today.getDay())).setHours(0, 0, 0));
  const weekEnd = new Date(new Date(today.setDate(today.getDate() + (6 - today.getDay()))).setHours(23, 59, 59));
  const thisWeeksActivities = user.sports_activities.filter((a) => {
    const activityDate = new Date(a.date)
    return activityDate <= weekEnd && activityDate >= weekStart
  })
  const activityList: DataList = [[], [], [], [], [], [], []];
  thisWeeksActivities.forEach((a) => {
    const day = new Date(a.date).getDay();
    activityList[day].push(a);
  })
  const data: Data = [[]];
  activityList.forEach((a) => {
    data[0].push(a.length);
  })
  return {
    yLabel: user.username,
    activityList: activityList
  }
}

export { generateY }