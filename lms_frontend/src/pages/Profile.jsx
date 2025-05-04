import React from "react";
import { useUser } from "../contexts/UserContext";

function Profile() {
  const { user } = useUser();

  return (
    <div className="container">
      <h4 className="mt-4">Profile</h4>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>First Name:</strong> {user.first_name}
      </p>
      <p>
        <strong>Last Name:</strong> {user.last_name}
      </p>
      <p>
        <strong>Bio:</strong> {user.bio || "Not set"}
      </p>
      <p>
        <strong>Interests:</strong> {user.interests || "Not set"}
      </p>
      <p>
        <strong>Qualifications:</strong> {user.qualifications || "Not set"}
      </p>
      <p>
        <strong>Instructor:</strong> {user.is_instructor ? "Yes" : "No"}
      </p>
    </div>
  );
}

export default Profile;
