// @ts-nocheck
import React from "react";

interface UserCardProps {
  user: {
    name: string;
    email: string;
    avatarUrl: string;
  };
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold">{user.name}</h2>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  );
};
