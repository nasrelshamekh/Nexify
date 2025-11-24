import { Button, Card, CardBody, Tabs, Tab, Skeleton, useDisclosure } from "@heroui/react";
import { BsCamera, BsThreeDotsVertical, BsPencil } from "react-icons/bs";
import { RiLockPasswordFill } from "react-icons/ri";
import Sidebar from "../../components/Sidebar/Sidebar";
import CardHeader from "../../components/PostCard/CardHeader";
import CardFooter from "../../components/PostCard/CardFooter";
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
  }, [data]);


  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* -------- COVER PHOTO -------- */}
      <div className="relative h-60 bg-gray-300">
        <img
          src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
          alt="cover"
          className="w-full h-full object-cover"
        />

        <Button
          size="sm"
          className="absolute bottom-3 right-3 bg-black/60 text-white"
          startContent={<BsCamera />}
        >
          Change Cover
        </Button>
      </div>
      <div className="grid grid-cols-4">
        <div className="col-span-1 mx-auto">
          <Sidebar />
        </div>
        <div className="col-span-2">
          {/* -------- PROFILE HEADER -------- */}
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative flex flex-col md:flex-row md:items-end gap-4 -mt-20">
              {/* Profile Image */}
              {isLoading ? <Skeleton className="shrink-0 flex rounded-full w-36 h-36" /> :
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={userData.photo}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>}

              {/* User Info */}
              <div className="grow">
                <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
                <p className="text-gray-500">Frontend Developer</p>

                <div className="flex gap-6 mt-3 text-gray-700">
                  <span><strong>{posts.length}</strong> Posts</span>
                  <span><strong>4.2K</strong> Followers</span>
                  <span><strong>302</strong> Following</span>
                </div>
              </div>

              {/* Edit Profile */}
              <div className="flex items-center gap-2">
                <Button variant="bordered" startContent={<BsPencil />}>
                  Edit Profile
                </Button>
                <Button variant="bordered" startContent={<RiLockPasswordFill />} onPress={onOpen} onOpenChange={onOpenChange}>
                  Change Password
                </Button>

                <Button variant="bordered" isIconOnly>
                  <BsThreeDotsVertical />
                </Button>
              </div>
            </div>

            {/* -------- TABS -------- */}
            <div className="mt-8">
              <Tabs
                aria-label="Profile Tabs"
                color="primary"
                variant="underlined"
                className="text-gray-700"
              >
                {/* POSTS TAB */}
                <Tab key="posts" title="Posts">
                  <div className="mt-6 space-y-6">
                    {isLoading ?
                      <PostSkeleton />
                      : posts.length === 0 ?
                        <p className="text-center text-gray-500 py-10">No posts yet.</p>
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
                  <div className="mt-6 space-y-6">

                    {/* ABOUT CARD */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>

                      {/* Bio */}
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Passionate Frontend Developer focused on creating clean, beautiful, and user-friendly
                        web experiences. Loves React, Tailwind, and building modern UI components.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* DETAILS LEFT */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold w-28 text-gray-700">Full Name:</span>
                            <span className="text-gray-600">{userData.name}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-semibold w-28 text-gray-700">Gender:</span>
                            <span className="text-gray-600">{userData.gender == "male" ? "Male" : "Female"}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-semibold w-28 text-gray-700">Email:</span>
                            <span className="text-gray-600">{userData.email}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-semibold w-28 text-gray-700">Date of Birth:</span>
                            <span className="text-gray-600">{userData.dateOfBirth}</span>
                          </div>
                        </div>



                        {/* DETAILS RIGHT */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold w-28 text-gray-700">Role:</span>
                            <span className="text-gray-600">Frontend Developer</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-semibold w-28 text-gray-700">Location:</span>
                            <span className="text-gray-600">Alexandria, Egypt</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-semibold w-28 text-gray-700">Joined:</span>
                            <span className="text-gray-600">{new Date(userData.createdAt).toLocaleString("en-US", { dateStyle: "long" })}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-semibold w-28 text-gray-700">Website:</span>
                            <a
                              href="#"
                              className="text-blue-600 hover:underline"
                            >
                              www.example.com
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* SKILLS CARD */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>

                      <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm shadow-sm">
                          React
                        </span>
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm shadow-sm">
                          Tailwind CSS
                        </span>
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm shadow-sm">
                          JavaScript
                        </span>
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm shadow-sm">
                          HTML
                        </span>
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm shadow-sm">
                          CSS
                        </span>
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm shadow-sm">
                          Git
                        </span>
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm shadow-sm">
                          Vite
                        </span>
                      </div>
                    </div>

                  </div>
                </Tab>


                <Tab key="friends" title="Friends">
                  <div className="p-4 text-gray-600">
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
