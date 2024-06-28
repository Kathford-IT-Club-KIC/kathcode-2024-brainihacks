import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useAuthCheck from "@/utils/hooks/withAuthCheck";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import UserItem from "./UserItem";

export default function Sidebar() {
  const { isAuthenticated, userProfile, isLoading } = useAuthCheck();
  const [userList, setUserList] = useState([]);
  const [userLoader, setUserLoader] = useState(true);
  const BASE_URL = "http://127.0.0.1:8000/";

  useEffect(() => {
    const authToken = localStorage.getItem("access_token");
    if (isAuthenticated) {
      axios
        .get(`${BASE_URL}api/chat/users/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setUserList(response.data);
          setUserLoader(false);
          console.log(response.data); // To verify the data being received
        })
        .catch((error) => {
          console.log("Error making API request", error);
        });
    }
  }, [isAuthenticated]);

  return (
    <div className="sidebar w-[320px] border-r border-black">
      <Table>
        <TableCaption>End-to-end encrypted.🔒</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <h1 className="text-black text-xl text-center">Inbox</h1>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!userLoader
            ? userList.map((user) => <UserItem user={user} key={user.id} />)
            : Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-4">
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
