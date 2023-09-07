
import { HeatMapGrid } from 'react-grid-heatmap'
import { generateY } from '../utils/generate-y-cells';
import { DataListList, User } from '../@types';
import { useState } from 'react';

function Heatmap({ user }: { user: User }) {
  const [userToFind, setUserToFind] = useState("");
  const [users, setUsers] = useState([user]);

  const xLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const yLabels: string[] = [];
  const usersActivities: DataListList = []; 

  users.forEach((u) => {
    const userInfo = generateY(u);
    usersActivities.push(userInfo.activityList);
    yLabels.push(userInfo.yLabel);
  })

  const data = new Array(yLabels.length)
  .fill(0)
  .map((_, i) =>
    new Array(xLabels.length)
      .fill(0)
      .map((_, j) => {
        // console.log(usersActivities[i][j].length)
        return usersActivities[i][j].length
      })
  );

  const compareUser = async() => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE}api/users/email/${userToFind}`);
      if (!response.ok) return alert("No user found");
      const result = await response.json() as User;
      console.log(result);
      setUsers([...users, result]);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <HeatMapGrid
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
        cellRender={(x, y, value) => {
          if (usersActivities[x][y].length === 0) {
            return <div title={"No activities today"}>{value}</div>
          } else {
            let title = "Today you have ";
            usersActivities[x][y].forEach((a, i) => {
              i === 0 ? title = title + a.activity : title = title + ` & ${a.activity}`
            })
            return <div title={title}>{value}</div>
          }
          
        }}
        xLabelsStyle={() => ({
          fontSize: ".65rem",
          textTransform: "uppercase",
        })}
        yLabelsStyle={() => ({
          fontSize: ".65rem",
          color: "#777"
        })}
        cellStyle={(_x, _y, ratio) => ({
          background: `rgb(12, 160, 44, ${ratio})`,
          fontSize: ".7rem",
          color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`
        })}
        cellHeight="1.5rem"
        xLabelsPos="top"
        onClick={(x, y) => {
          // alert(`Clicked (${x}, ${y})`);
          console.log(usersActivities[x][y])
        }}
        // yLabelsPos="right"
        // square
      />
      <p>Compare my activity heatmap against: </p>
      <input value={userToFind} onChange={(e) => setUserToFind(e.target.value)}/>
      <button onClick={compareUser}>Find User</button>
    </div>
  )
}

export default Heatmap