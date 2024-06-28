
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function Message({ text, sent }) {
  return (
    <div className={` message  ${sent ? "flex justify-end" : "flex gap-2 items-end  max-w-[40%] justify-start"}`}>
          <span className={`ml-2 ${sent ? "text-red-100" : "text-blue-700"}`}>
            {sent? "" : <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>}
          </span>
      <div className={` p-2 rounded-t-xl   ${sent ? "bg-blue-700 rounded-l-xl text-white" : "bg-gray-100 border rounded-r-xl"}`}>
          <p>{text}</p>
      </div>
    </div>
  );
}
