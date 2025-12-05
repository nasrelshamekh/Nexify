import { Button, Card, CardBody, Tabs, Tab, Skeleton, useDisclosure } from "@heroui/react";
import { BsCamera, BsThreeDotsVertical, BsPencil } from "react-icons/bs";
import { RiLockPasswordFill } from "react-icons/ri";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getUserPosts } from "../../services/postServices";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../Context/AuthContext";
import Post from "../../components/Post/Post";
import PostSkeleton from './../../components/Skeletons/PostSkeleton';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UserProfileModal from "../../components/UserProfileModal/UserProfileModal";

export default function UserProfile() {

  const { userData } = useContext(authContext)
  const [posts, setPosts] = useState([]);
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Fetch user posts using React Query
  const { data, isLoading } = useQuery({
    queryKey: ["userPosts", userData?._id],
    queryFn: () => getUserPosts(userData._id),
    enabled: !!userData?._id, // only run if userData._id exists
  });

  useEffect(() => {
    if (data?.data?.posts) setPosts(data.data.posts);
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [data]);


  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* -------- COVER PHOTO -------- */}
      <div className="relative h-40 sm:h-48 md:h-60 bg-gray-300">
        <img
          src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
          alt="cover"
          className="w-full h-full object-cover"
        />

        <Button
          size="sm"
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/60 text-white text-xs sm:text-sm"
          startContent={<BsCamera className="text-sm sm:text-base" />}
        >
          <span className="hidden sm:inline">Change Cover</span>
          <span className="sm:hidden">Cover</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-5">
        {/* Sidebar - Hidden on mobile/tablet */}
        <div className="hidden lg:block lg:col-span-1 lg:mx-auto">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-span-1 lg:col-span-2">
          {/* -------- PROFILE HEADER -------- */}
          <div className="w-full px-3 sm:px-4">
            <div className="relative flex flex-col md:flex-row md:items-end gap-3 sm:gap-4 -mt-12 sm:-mt-16 md:-mt-20">
              {/* Profile Image */}
              {isLoading ? <Skeleton className="shrink-0 flex rounded-full w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto md:mx-0" /> :
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto md:mx-0">
                  <img
                    src={userData.photo}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>}

              {/* User Info */}
              <div className="grow text-center md:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 md:text-white">{userData.name}</h1>
                <p className="text-sm sm:text-base text-gray-500">Frontend Developer</p>

                <div className="flex justify-center md:justify-start gap-4 sm:gap-6 mt-2 sm:mt-3 text-sm sm:text-base text-gray-700">
                  <span><strong>{posts.length}</strong> Posts</span>
                  <span><strong>4.2K</strong> Followers</span>
                  <span><strong>302</strong> Following</span>
                </div>
              </div>

              {/* Edit Profile - Desktop */}
              <div className="hidden md:flex items-center gap-2">
                <Button variant="bordered" startContent={<BsPencil />} size="sm">
                  Edit Profile
                </Button>
                <Button variant="bordered" startContent={<RiLockPasswordFill />} onPress={onOpen} onOpenChange={onOpenChange} size="sm">
                  Change Password
                </Button>

                <Button variant="bordered" isIconOnly size="sm">
                  <BsThreeDotsVertical />
                </Button>
              </div>
            </div>

            {/* Edit Profile Buttons - Mobile */}
            <div className="flex md:hidden gap-2 mt-4 justify-center">
              <Button variant="bordered" startContent={<BsPencil />} size="sm" className="flex-1">
                Edit Profile
              </Button>
              <Button variant="bordered" startContent={<RiLockPasswordFill />} onPress={onOpen} onOpenChange={onOpenChange} size="sm" className="flex-1">
                Change Password
              </Button>
              <Button variant="bordered" isIconOnly size="sm">
                <BsThreeDotsVertical />
              </Button>
            </div>

            {/* -------- TABS -------- */}
            <div className="mt-6 sm:mt-8">
              <Tabs
                aria-label="Profile Tabs"
                color="primary"
                variant="underlined"
                className="text-gray-700"
                classNames={{
                  tabList: "gap-4 sm:gap-6 w-full",
                  tab: "text-sm sm:text-base px-2 sm:px-4"
                }}
              >
                {/* POSTS TAB */}
                <Tab key="posts" title="Posts">
                  <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                    {isLoading ?
                      <PostSkeleton />
                      : posts.length === 0 ?
                        <p className="text-center text-gray-500 py-10 text-sm sm:text-base">No posts yet.</p>
                        :
                        posts.map((post) => (
                          <Post
                            key={post._id}
                            post={post}
                            getAllPosts={() =>
                              queryClient.invalidateQueries(["userPosts", userData._id])
                            }
                          />
                        ))
                    }
                  </div>
                </Tab>

                <Tab key="about" title="About">
                  <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">

                    {/* ABOUT CARD */}
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">About</h2>

                      {/* Bio */}
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                        Passionate Frontend Developer focused on creating clean, beautiful, and user-friendly
                        web experiences. Loves React, Tailwind, and building modern UI components.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                        {/* DETAILS LEFT */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-semibold sm:w-28 text-gray-700 text-sm sm:text-base">Full Name:</span>
                            <span className="text-gray-600 text-sm sm:text-base">{userData.name}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-semibold sm:w-28 text-gray-700 text-sm sm:text-base">Gender:</span>
                            <span className="text-gray-600 text-sm sm:text-base">{userData.gender == "male" ? "Male" : "Female"}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-semibold sm:w-28 text-gray-700 text-sm sm:text-base">Email:</span>
                            <span className="text-gray-600 text-sm sm:text-base break-all">{userData.email}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-semibold sm:w-28 text-gray-700 text-sm sm:text-base">Date of Birth:</span>
                            <span className="text-gray-600 text-sm sm:text-base">{userData.dateOfBirth}</span>
                          </div>
                        </div>

                        {/* DETAILS RIGHT */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-semibold sm:w-28 text-gray-700 text-sm sm:text-base">Role:</span>
                            <span className="text-gray-600 text-sm sm:text-base">Frontend Developer</span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-semibold sm:w-28 text-gray-700 text-sm sm:text-base">Location:</span>
                            <span className="text-gray-600 text-sm sm:text-base">Alexandria, Egypt</span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-semibold sm:w-28 text-gray-700 text-sm sm:text-base">Joined:</span>
                            <span className="text-gray-600 text-sm sm:text-base">{new Date(userData.createdAt).toLocaleString("en-US", { dateStyle: "long" })}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="font-semibold sm:w-28 text-gray-700 text-sm sm:text-base">Website:</span>
                            <a
                              href="#"
                              className="text-blue-600 hover:underline text-sm sm:text-base break-all"
                            >
                              www.example.com
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* SKILLS CARD */}
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Skills</h2>

                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm shadow-sm">
                          React
                        </span>
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm shadow-sm">
                          Tailwind CSS
                        </span>
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm shadow-sm">
                          JavaScript
                        </span>
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm shadow-sm">
                          HTML
                        </span>
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm shadow-sm">
                          CSS
                        </span>
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm shadow-sm">
                          Git
                        </span>
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm shadow-sm">
                          Vite
                        </span>
                      </div>
                    </div>

                  </div>
                </Tab>

                <Tab key="friends" title="Friends">
                  <div className="p-4 text-gray-600 text-sm sm:text-base">
                    Friends
                  </div>
                </Tab>
              </Tabs>
            </div>

          </div>
        </div>

      </div>
      <UserProfileModal isOpen={isOpen} onOpenChange={onOpenChange} />

    </div >

  );
}