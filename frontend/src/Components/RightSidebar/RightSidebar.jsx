import React from "react";
import "../../styles/RightSidebar.css";

const recommendedUsers = [
  { username: "john_doe", profilePic: "https://via.placeholder.com/50" },
  { username: "jane_smith", profilePic: "https://via.placeholder.com/50" },
  { username: "cool_coder", profilePic: "https://via.placeholder.com/50" },
  { username: "dev_guru", profilePic: "https://via.placeholder.com/50" },
];

const RightSidebar = ({zInd}) => {
  return (
    <div className="rightSidebar" style={{ zIndex: zInd }}>
      <h2 className="title">Recommended Users</h2>
      <ul className="userList">
        {recommendedUsers.map((user, index) => (
          <li key={index} className="userItem">
            <img
              src={user.profilePic}
              alt={`${user.username}'s profile`}
              className="profilePic"
            />
            <span className="username">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
