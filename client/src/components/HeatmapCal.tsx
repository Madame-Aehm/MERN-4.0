import { Sports_activity, User } from '../@types'
import CalendarHeatmap from 'react-calendar-heatmap';
import './heatmap.css'
import { useEffect, useState } from 'react';
import generateValues from '../utils/generateValues';

type Props = { user: User }

interface FullObject { date: string, count: Sports_activity[] }
interface ValueObject { date: string, count: number }

function HeatmapCal({ user }: Props) {
  const [fullValues, setFullValues] = useState<FullObject[]>([]);
  const [values, setValues] = useState<ValueObject[]>([]);
  const year = new Date().getFullYear();
  const startDate = new Date("01/01/"+year);
  const endDate = new Date(new Date("12/31/"+year).setHours(23, 59, 59));

  useEffect(() => {
    const findValues = generateValues(user);
    setValues(findValues.data2);
    setFullValues(findValues.data1)
  }, [user])
  // console.log(values)
  
  return (
    // <h1>hello</h1>
    <CalendarHeatmap
      startDate={startDate}
      endDate={endDate}
      values={values}
      onClick={(value) => {
        if (value) {
          let string = "Today you have ";
          const eq = fullValues.find((d) => d.date === value.date);
          eq && eq.count.forEach((e, i) => {
            i === 0 ? string = string + e.activity : string = string + ` & ${e.activity}`
          })
          alert(string)
        } else alert("No activities today");
      }}
      showWeekdayLabels
      classForValue={(value) => {  
        if (!value) {
          return 'color-empty';
        }
        return `color-gitlab-${value.count > 4 ? 4 : value.count}`;
      }}
    />
  )
}

export default HeatmapCal

