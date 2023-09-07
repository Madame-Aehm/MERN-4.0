import { useEffect, useState } from "react";
import { NotOk, User, Users } from "../@types";

type Props = {
  user: User;
};

function UserCard({ user }: Props) {
  const [participant, setParticipant] = useState<Users>([]);

  useEffect(() => {
    const fetchUsersWithId = (user: User) => {
      if (user.sports_activities) {
        user.sports_activities.map(async (sport_activity) => {
          try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASE}api/users/_id/${sport_activity.participants}`);
            if (response.ok) {
              const result = (await response.json()) as Users;
              setParticipant(result);
              // console.log(result);
            } else {
              const result = (await response.json()) as NotOk;
              alert(result.error);
            }
          } catch (error) {
            console.log(error);
            const { message } = error as Error;
            alert(message);
          }
        });
      }
    };
    fetchUsersWithId(user);
  }, [user]);

  return (
    user && (
      <div style={{ border: "solid 1px black", padding: "0 1em", width: "300px" }}>
        <p>
          <b>{user.username}</b> - {user.email} <img src={user.profile_pic} alt={`${user.username}'s profile picture`} style={{ height: "70px", width: "70px" }} />
        </p>
        {user.sports_activities.length === 0 ? (
          <p>No upcoming activities</p>
        ) : (
          <>
            <p>Upocoming activities</p>
            <ul>
              {user.sports_activities.map((p) => {
                return (
                  <div key={p._id}>
                    <li>
                      {p.activity} on {p.date} for {p.duration} with{" "}
                    </li>
                  </div>
                );
              })}
              <span>
                {" "}
                {participant && participant.username} - {participant && participant.email}
              </span>
            </ul>
          </>
        )}
      </div>
    )
  );
}

export default UserCard;
