import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical, PenIcon, Trash } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

const Reply = ({
  reply,
  onDelete,
  setIsEditing,
  handleEdit,
  setContext,
  isEditing,
  context,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const toggleOptions = () => setShowOptions((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div key={reply.id} className="space-y-1 group relative">
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{reply.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 w-full">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-sm">{reply.username}</h4>

            <Popover>
              <PopoverTrigger asChild>
                <EllipsisVertical className="rounded-full p-1 hover:bg-slate-100 cursor-pointer transition-all duration-200 ease-in-out" />
              </PopoverTrigger>
              <PopoverContent className="w-28 p-2 border rounded-lg shadow-lg bg-white space-y-1">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start px-2 py-1 text-sm rounded hover:bg-slate-100 transition-colors duration-200 ease-in-out"
                  onClick={() => setIsEditing(true)}
                >
                  <PenIcon className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start px-2 py-1 text-sm rounded hover:bg-slate-100 transition-colors duration-200 ease-in-out"
                  onClick={onDelete}
                >
                  <Trash className="mr-2 h-4 w-4 text-red-500" />
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
          </div>
          <span className="text-xs text-muted-foreground">
            {reply.commented_at}
          </span>
          {isEditing ? (
            <div>
              {/* Shadcnui Text Input with comment context as the initial value */}
              <Input
                type="text"
                className="shadcnui-input" // Apply Shadcnui styles as needed
                defaultValue={reply.context}
                value={context} // Prefilled with current comment context
                onChange={(e) => setContext(e.target.value)}
              />
              <Button
                variant={"ghost"}
                onClick={() => {
                  setIsEditing(false); // Change editing state on submit
                }}
              >
                Cancel
              </Button>
              {/* Submit Button to save changes and toggle editing state */}
              <Button
                onClick={() => {
                  handleEdit(reply.id);
                  setIsEditing(false); // Change editing state on submit
                }}
              >
                Submit
              </Button>
            </div>
          ) : (
            <p>{reply.context}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reply;
