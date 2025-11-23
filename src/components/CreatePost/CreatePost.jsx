import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input, useDisclosure, Skeleton } from "@heroui/react";
import { HiVideoCamera } from "react-icons/hi2";
import { FaImage } from "react-icons/fa";
import { BsPlayBtnFill } from "react-icons/bs";
import { FaFaceGrin } from "react-icons/fa6";
import CreatePostModal from "./CreatePostModal";
import { useContext } from "react";
import { authContext } from "../../Context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatePost() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { userData, isLoading } = useContext(authContext)
  const queryClient = useQueryClient();

  return (
    <>

      <Card className="">
        {isLoading ? <div className="flex justify-between items-center gap-2 p-3">
          <Skeleton className="shrink-0 flex rounded-full size-10" />
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div> : <div className="flex items-center gap-2 p-3">
          <div className="size-10 rounded-full overflow-hidden">
            <img src={userData.photo} alt="User Image" />
          </div>
          <Input type="email" isReadOnly placeholder={`What's on your mind, ${userData.name}?`} onClick={onOpen} />
        </div>}
        <Divider />
        <CardFooter>
          {isLoading ? <Skeleton className="h-3 w-full rounded-lg m-3 p-3" /> : <div className="grid grid-cols-4 w-full">
            <div className="col-span-1 p-2">
              <div className="flex items-center gap-2 justify-center cursor-pointer">
                <HiVideoCamera className="size-6 text-orange-400" />
                <span className="font-medium">Go Live</span>
              </div>

            </div>
            <div className="col-span-1 p-2">
              <div className="flex items-center gap-2 justify-center cursor-pointer">
                <FaImage className="size-6 text-green-400" />
                <span className="font-medium">Photo</span>
              </div>

            </div>
            <div className="col-span-1 p-2">
              <div className="flex items-center gap-2 justify-center cursor-pointer">
                <BsPlayBtnFill className="size-6 text-pink-600" />
                <span className="font-medium">Video</span>
              </div>

            </div>
            <div className="col-span-1 p-2">
              <div className="flex items-center gap-2 justify-center cursor-pointer">
                <FaFaceGrin className="size-6 text-blue-400" />
                <span className="font-medium">Feeling</span>
              </div>

            </div>

          </div>}

        </CardFooter>
      </Card>
      <CreatePostModal callback={() => queryClient.invalidateQueries(["getPosts"])} isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
