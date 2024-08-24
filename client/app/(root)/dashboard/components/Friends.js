"use client";
import { useEffect, useState } from "react";
import { getFriendRequests } from "@/lib/ApiHelper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Friends({ setReceiverId, userId }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { rows } = await getFriendRequests(userId);
        setFriends(rows);
      } catch (err) {
        setError("Failed to load friends. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  const friendsList = friends?.map((friend, index) => {
    const id = friend.sender_id === userId ? friend.receiver_id : friend.sender_id;
    return (
      <div className="flex items-center gap-4" key={index} onClick={() => setReceiverId(id)}>
        <Avatar className="h-9 w-9 sm:flex">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <p className="text-sm font-medium leading-none">{id}</p>
          <p className="text-sm text-muted-foreground">user.email@example.com</p>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">+ $1,999.00</div>
      </div>
    );
  });

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {loading && <p>Loading friends...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && friends.length === 0 && <p>No friends yet.</p>}
        {!loading && !error && friendsList}
      </CardContent>
    </Card>
  );
}
