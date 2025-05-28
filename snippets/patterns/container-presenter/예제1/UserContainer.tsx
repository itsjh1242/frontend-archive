// @ts-nocheck
import { React, useEffect, useState } from "react";
import { UserCard } from "./UserCard";

type User = {
  name: string;
  email: string;
};

export const UserContainer: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then(setUser);
  }, []);

  if (!user) return <div>Loading...</div>;

  return <UserCard user={user} />;
};
