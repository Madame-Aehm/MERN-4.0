import { User, sports_activities } from '../@types'
import CalendarHeatmap from 'react-calendar-heatmap';
import './heatmap.css'
import { useEffect, useState } from 'react';

type Props = { user: User }

interface FullObject { date: string, count: sports_activities[] }
interface ValueObject { date: string, count: number }

function HeatmapCal({ user }: Props) {
  const [values, setValues] = useState<ValueObject[]>([]);
  const year = new Date().getFullYear();
  const startDate = new Date("01/01/"+year);
  const endDate = new Date(new Date("12/31/"+year).setHours(23, 59, 59));
  useEffect(() => {
    const findValues = generateValues(user);
    setValues(findValues.data2);

  }, [])
  // console.log(values)
  
  return (
    // <h1>hello</h1>
    <CalendarHeatmap
      startDate={startDate}
      endDate={endDate}
      values={values}
      classForValue={(value) => {  
        if (!value) {
          return 'color-empty';
        }
        return `color-scale-${value.count}`;
      }}
    />
  )
}

export default HeatmapCal

function generateValues (user: User): { data1: FullObject[], data2: ValueObject[] } {
  const data1: FullObject[] = [];
  const data2: ValueObject[] = [];
  user.sports_activities.forEach((sa, x) => {
    if (x === 0) data1.push({ date: sa.date, count: [sa] });
    else {
      for (let i = 0; i < data1.length; i++) {
        if (sa.date === data1[i].date) {
          data1[i].count.push(sa);
          break;
        } 
        if (i === data1.length - 1) {
          data1.push({ date: sa.date, count: [sa] })
        }
      }
    }
  })
  data1.forEach((d) => data2.push({ date: d.date, count: d.count.length }))
  console.log("data1", data1, "data2", data2)

  return {data1, data2}
}