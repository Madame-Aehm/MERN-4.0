import { Sports_activity, User } from "../@types";

interface FullObject { date: string, count: Sports_activity[] }
interface ValueObject { date: string, count: number }

function generateValues (user: User): { data1: FullObject[], data2: ValueObject[] } {
  const data1: FullObject[] = [];
  const data2: ValueObject[] = [];
  user.sports_activities.forEach((sa, x) => {
    if (x === 0) {
      data1.push({ date: sa.date, count: [sa] })
    } else {
      for (let i = 0; i < data1.length; i++) {
        if (sa.date === data1[i].date) {
          data1[i].count.push(sa);
          break;
        }
        if (i === data1.length - 1) {
          data1.push({ date: sa.date, count: [sa] })
          break;
        }
      }
    }
  })
  data1.forEach((d) => {
    data2.push({ date: d.date, count: d.count.length })
  })
  return {data1, data2}
}

export default generateValues