import Message from "./Message";
import {
 
  TableCell,

  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./MessageInput";
import withAuth from "@/utils/withAuth";
function ChatArea() {
  return (
    <div className="chat-area flex flex-col justify-between w-[70vw] relative">
        <div className="chat-header border-b border-black bg-white">
        <TableRow>
            <TableCell className='flex items-center gap-4'>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              John Doe
            </TableCell>
          </TableRow>
        </div>
        <div className="messages overflow-y-auto flex flex-col ">
            <Message text='Hi' sent/>
            <Message text='Hi, howdy?' recieved/>
        </div>
        <MessageInput/>
    </div>
  )
}
export default withAuth(ChatArea);