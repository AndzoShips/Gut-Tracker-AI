"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  email?: string;
  name?: string;
  username?: string;
}

export function UserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="text-3 text-gray-10">
      {user.name || user.email || `@${user.username}` || "User"}
    </div>
  );
}

