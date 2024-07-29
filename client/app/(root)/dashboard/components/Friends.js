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

export default function Friends({setReceiverId, userId }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const { rows } = await getFriendRequests(userId);
      setFriends(rows);
      console.log("rows", rows);
      console.log(friends);
    };
    fetchFriends();
  }, [userId]);

  useEffect(() => {
    setFriends(friends);
  }, [friends]);

  const friendsList = friends?.map((friend, index) => {
    const id=friend.sender_id === userId
    ? friend.receiver_id
    : friend.sender_id
    return (
      <div className="flex items-center gap-4" key={index} onClick={()=>setReceiverId(id)}>
        <Avatar className="h-9 w-9 sm:flex">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <p className="text-sm font-medium leading-none">
            {id}
          </p>
          <p className="text-sm text-muted-foreground">
            olivia.martin@email.com
          </p>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">+$1,999.00</div>
      </div>
    );
  });

  return (
    // <div>
    //   <h2>Friends</h2>
    //   {friends.length === 0 && <p>No friends yet.</p>}
    //   {friends.map((friend) => (
    //     <div key={friend.id}>
    //       <p>
    //         {friend.sender_id === (userId)
    //           ? `Friend: User ${friend.receiver_id}`
    //           : `Friend: User ${friend.sender_id}`}
    //       </p>
    //     </div>
    //   ))}
    // </div>
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {friends.length === 0 && <p>No friends yet.</p>}
        {friendsList}
      </CardContent>
    </Card>
  );
}
