import {
  Button,
  Card,
  CardBody,
  Tabs,
  Tab,
  Skeleton,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  Avatar,
  Chip,
} from "@heroui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsCamera, BsThreeDotsVertical, BsPencil, BsGrid3X3Gap, BsShareFill } from "react-icons/bs";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  FiMail,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiGlobe,
  FiUser,
  FiClock,
  FiShare2,
  FiCopy,
  FiExternalLink,
  FiEdit3,
} from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { FaUserFriends, FaVenusMars } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { MdOutlineFeed } from "react-icons/md";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getUserPosts } from "../../services/postServices";
import { uploadProfilePhoto } from "../../services/authServices";
import { authContext } from "../../Context/AuthContext";
import Post from "../../components/Post/Post";
import PostSkeleton from "./../../components/Skeletons/PostSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UserProfileModal from "../../components/UserProfileModal/UserProfileModal";
import EditProfileModal from "../../components/UserProfileModal/EditProfileModal";
import CreatePostModal from "../../components/CreatePost/CreatePostModal";
import { toast } from "react-toastify";

// Default curated cover photos
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2000&auto=format&fit=crop";

// Sample connections for Friends tab
const SAMPLE_FRIENDS = [
  {
    id: 1,
    name: "Sara Eslam",
    role: "UI/UX Designer",
    mutual: 14,
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?cs=srgb&dl=pexels-pixabay-415829.jpg&fm=jpg",
    online: true,
  },
  {
    id: 2,
    name: "Abdelrauof Ali",
    role: "Fullstack Engineer",
    mutual: 23,
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?cs=srgb&dl=pexels-justin-shaifer-501272-1222271.jpg&fm=jpg",
    online: true,
  },
  {
    id: 3,
    name: "Madiha Ahmed",
    role: "Product Manager",
    mutual: 8,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?cs=srgb&dl=pexels-moose-photos-170139-774909.jpg&fm=jpg",
    online: false,
  },
  {
    id: 4,
    name: "Sayed Mohamed",
    role: "Mobile Developer",
    mutual: 19,
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg",
    online: true,
  },
  {
    id: 5,
    name: "Karim Hassan",
    role: "DevOps Specialist",
    mutual: 5,
    avatar:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?cs=srgb&dl=pexels-stefanstefancik-91227.jpg&fm=jpg",
    online: false,
  },
  {
    id: 6,
    name: "Nouran Tarek",
    role: "Graphic Designer",
    mutual: 11,
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?cs=srgb&dl=pexels-olly-1181686.jpg&fm=jpg",
    online: true,
  },
];

// Curated skills with themed accent palettes
const SKILLS_LIST = [
  { name: "React 19", bg: "bg-cyan-500/10 text-cyan-600 border-cyan-200" },
  { name: "Next.js", bg: "bg-gray-900/10 text-gray-800 border-gray-300" },
  { name: "Tailwind CSS", bg: "bg-teal-500/10 text-teal-600 border-teal-200" },
  { name: "JavaScript (ES6+)", bg: "bg-amber-500/10 text-amber-700 border-amber-200" },
  { name: "TypeScript", bg: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { name: "Vite", bg: "bg-purple-500/10 text-purple-600 border-purple-200" },
  { name: "HTML5 & CSS3", bg: "bg-orange-500/10 text-orange-600 border-orange-200" },
  { name: "Git & GitHub", bg: "bg-rose-500/10 text-rose-600 border-rose-200" },
  { name: "RESTful APIs", bg: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  { name: "HeroUI & Motion", bg: "bg-violet-500/10 text-violet-600 border-violet-200" },
];

export default function UserProfile() {
  const { userData } = useContext(authContext);
  const queryClient = useQueryClient();

  // Modals disclosure
  const {
    isOpen: isPassOpen,
    onOpen: onPassOpen,
    onOpenChange: onPassOpenChange,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();

  // Custom profile local overrides
  const [profileData, setProfileData] = useState({
    role: "Frontend Developer",
    location: "Alexandria, Egypt",
    bio: "Passionate Frontend Developer focused on creating clean, beautiful, and user-friendly web experiences. React, Tailwind CSS, and modern web applications.",
    website: "www.example.com",
  });

  const [coverPhoto, setCoverPhoto] = useState(DEFAULT_COVER);
  const [avatarPhoto, setAvatarPhoto] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const coverFileRef = useRef(null);
  const avatarFileRef = useRef(null);

  // Load custom profile data from localStorage
  useEffect(() => {
    if (userData?.email) {
      try {
        const cached = localStorage.getItem(`nexify_profile_custom_${userData.email}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          setProfileData((prev) => ({ ...prev, ...parsed }));
        }
        const cachedCover = localStorage.getItem(`nexify_cover_${userData.email}`);
        if (cachedCover) setCoverPhoto(cachedCover);
      } catch (e) {
        console.error("Failed to load cached profile details:", e);
      }
    }
  }, [userData?.email]);

  // Query user posts
  const { data, isLoading } = useQuery({
    queryKey: ["userPosts", userData?._id],
    queryFn: () => getUserPosts(userData?._id),
    enabled: !!userData?._id,
  });

  const posts = data?.data?.data?.posts ?? [];

  // Collect photos from posts for Photos tab
  const postPhotos = posts
    .filter((p) => p.image && !p.image.includes("/undefined"))
    .map((p) => ({ id: p._id, src: p.image, date: p.createdAt, body: p.body }));

  // Handle Cover image selection
  function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPhoto(url);
      if (userData?.email) {
        // Cache data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            localStorage.setItem(`nexify_cover_${userData.email}`, reader.result);
          } catch (err) {}
        };
        reader.readAsDataURL(file);
      }
      toast.success("Cover photo updated!");
    }
  }

  // Handle Avatar image upload
  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPhoto(previewUrl);
    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      await uploadProfilePhoto(formData);
      toast.success("Profile photo updated successfully!");
      queryClient.invalidateQueries(["userPosts", userData?._id]);
    } catch (err) {
      console.error("Avatar upload notice:", err);
      toast.success("Profile avatar preview updated!");
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  function copyProfileLink() {
    navigator.clipboard?.writeText?.(window.location.href);
    toast.success("Profile link copied to clipboard!");
  }

  // Safe date formatting
  function formatJoinedDate(rawDate) {
    if (!rawDate) return "May 2026";
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return "May 2026";
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  function formatBirthDate(rawDate) {
    if (!rawDate) return "Not specified";
    const d = new Date(rawDate);
    if (isNaN(d.getTime()) || d.getFullYear() < 1920) {
      return "October 14, 2001";
    }
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const currentAvatar =
    avatarPhoto ||
    userData?.photo ||
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={coverFileRef}
        onChange={handleCoverChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={avatarFileRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      <div className="container px-3 sm:px-5 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Left Sidebar - Hidden on mobile/tablet, aligned with NewsFeed */}
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Profile Column */}
          <div className="col-span-1 lg:col-span-3 space-y-5">
            {/* ======================================================== */}
            {/* HERO PROFILE CARD */}
            {/* ======================================================== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden">
              {/* Cover Banner */}
              <div className="relative h-44 sm:h-56 md:h-64 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500 overflow-hidden group">
                <img
                  src={coverPhoto}
                  alt="Profile cover banner"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />

                {/* Change Cover Button */}
                <button
                  onClick={() => coverFileRef.current?.click()}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full text-xs sm:text-sm font-medium border border-white/20 transition-all cursor-pointer shadow-md"
                >
                  <BsCamera className="text-sm sm:text-base" />
                  <span>Change Cover</span>
                </button>
              </div>

              {/* Profile Details Container (inside white card) */}
              <div className="px-4 sm:px-6 md:px-8 pb-6">
                {/* Header row: Avatar + Desktop Action Buttons */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-14 sm:-mt-18 md:-mt-22 mb-4">
                  {/* Avatar with Camera badge */}
                  <div className="relative shrink-0 mx-auto md:mx-0">
                    <img
                      src={currentAvatar}
                      alt={userData?.name || "User profile"}
                      className="size-28 sm:size-36 md:size-40 rounded-full object-cover border-4 border-white shadow-xl bg-white"
                    />
                    <button
                      onClick={() => avatarFileRef.current?.click()}
                      className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 size-8 sm:size-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer transition transform hover:scale-110"
                      title="Update profile photo"
                    >
                      <BsCamera className="size-4" />
                    </button>
                  </div>

                  {/* Desktop Actions */}
                  <div className="hidden md:flex items-center gap-2.5 pb-2">
                    <Button
                      onPress={onEditOpen}
                      color="primary"
                      variant="solid"
                      startContent={<BsPencil size={15} />}
                      size="sm"
                      className="font-medium shadow-sm cursor-pointer"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      onPress={onPassOpen}
                      variant="bordered"
                      startContent={<RiLockPasswordFill size={15} />}
                      size="sm"
                      className="font-medium bg-white hover:bg-gray-50 border-gray-300 text-gray-700 cursor-pointer"
                    >
                      Change Password
                    </Button>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger className="cursor-pointer">
                        <Button
                          isIconOnly
                          variant="bordered"
                          size="sm"
                          className="border-gray-300 text-gray-700 bg-white"
                        >
                          <BsThreeDotsVertical size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Profile extra options">
                        <DropdownItem
                          key="copy"
                          startContent={<FiCopy size={15} />}
                          onClick={copyProfileLink}
                        >
                          Copy Profile Link
                        </DropdownItem>
                        <DropdownItem
                          key="create"
                          startContent={<FiEdit3 size={15} />}
                          onClick={onCreateOpen}
                        >
                          Create New Post
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>

                {/* User info & Stats row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Name, badges, bio */}
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        {userData?.name || "User"}
                      </h1>
                      <HiBadgeCheck
                        className="text-blue-500 size-6 sm:size-7 shrink-0"
                        title="Verified Member"
                      />
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mt-2 text-xs sm:text-sm">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                        {profileData.role}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <FiMapPin className="text-gray-400" />
                        {profileData.location}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <FiClock className="text-gray-400" />
                        Joined {formatJoinedDate(userData?.createdAt)}
                      </span>
                    </div>

                    {/* Bio paragraph */}
                    <p className="text-sm text-gray-600 mt-3 max-w-2xl leading-relaxed">
                      {profileData.bio}
                    </p>
                  </div>

                  {/* Interactive Stats cards */}
                  <div className="flex items-center justify-center gap-3 shrink-0 pt-1">
                    <div className="px-4 py-2.5 bg-gray-50 hover:bg-blue-50/50 rounded-xl border border-gray-200/80 text-center transition cursor-pointer min-w-20">
                      <div className="text-lg sm:text-xl font-bold text-gray-900">
                        {posts.length}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Posts</div>
                    </div>
                    <div className="px-4 py-2.5 bg-gray-50 hover:bg-blue-50/50 rounded-xl border border-gray-200/80 text-center transition cursor-pointer min-w-20">
                      <div className="text-lg sm:text-xl font-bold text-gray-900">4.2K</div>
                      <div className="text-xs text-gray-500 font-medium">Followers</div>
                    </div>
                    <div className="px-4 py-2.5 bg-gray-50 hover:bg-blue-50/50 rounded-xl border border-gray-200/80 text-center transition cursor-pointer min-w-20">
                      <div className="text-lg sm:text-xl font-bold text-gray-900">302</div>
                      <div className="text-xs text-gray-500 font-medium">Following</div>
                    </div>
                  </div>
                </div>

                {/* Mobile action buttons */}
                <div className="flex md:hidden items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <Button
                    onPress={onEditOpen}
                    color="primary"
                    variant="solid"
                    startContent={<BsPencil size={15} />}
                    size="sm"
                    className="flex-1 font-medium"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onPress={onPassOpen}
                    variant="bordered"
                    startContent={<RiLockPasswordFill size={15} />}
                    size="sm"
                    className="flex-1 font-medium bg-white"
                  >
                    Password
                  </Button>
                  <Button
                    isIconOnly
                    variant="bordered"
                    size="sm"
                    onClick={copyProfileLink}
                    className="border-gray-300 text-gray-700 bg-white"
                  >
                    <FiCopy size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* TABS CONTAINER */}
            {/* ======================================================== */}
            <div>
              <Tabs
                aria-label="Profile Content Tabs"
                color="primary"
                variant="underlined"
                classNames={{
                  base: "w-full bg-white rounded-xl shadow-sm border border-gray-200/90 px-2 sm:px-4 py-0.5",
                  tabList: "flex justify-between sm:justify-start gap-1 sm:gap-6 md:gap-8 w-full border-b-0",
                  tab: "text-xs sm:text-sm md:text-base font-medium py-3 data-[selected=true]:text-blue-600 px-1.5 sm:px-3",
                  cursor: "bg-blue-600 h-0.5",
                }}
              >
                {/* ----------------- 1. POSTS TAB ----------------- */}
                <Tab
                  key="posts"
                  title={
                    <div className="flex items-center gap-1.5">
                      <MdOutlineFeed className="text-base sm:text-lg" />
                      <span>Posts</span>
                      <span className="hidden sm:inline px-1.5 py-0.2 text-xs rounded-full bg-gray-100 text-gray-600 font-semibold">
                        {posts.length}
                      </span>
                    </div>
                  }
                >
                  <div className="mt-4 space-y-4">
                    {/* Quick Create Post prompt */}
                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200/90 flex items-center gap-3">
                      <img
                        src={currentAvatar}
                        alt="User"
                        className="size-10 rounded-full object-cover shrink-0"
                      />
                      <div
                        onClick={onCreateOpen}
                        className="flex-1 bg-gray-50 hover:bg-gray-100/80 px-4 py-2.5 rounded-full text-xs sm:text-sm text-gray-500 cursor-pointer transition border border-gray-200/60"
                      >
                        What's on your mind, {userData?.name || "there"}?
                      </div>
                      <Button
                        size="sm"
                        color="primary"
                        onPress={onCreateOpen}
                        className="font-medium cursor-pointer shrink-0"
                      >
                        Post
                      </Button>
                    </div>

                    {/* Posts List or Empty State */}
                    {isLoading ? (
                      <div className="space-y-4">
                        <PostSkeleton />
                        <PostSkeleton />
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-sm border border-gray-200/90">
                        <div className="size-16 mx-auto rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-2xl mb-4">
                          <MdOutlineFeed />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          No posts shared yet
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5 leading-relaxed">
                          Publish your thoughts, projects, or photos with your Nexify network.
                        </p>
                        <Button
                          color="primary"
                          onPress={onCreateOpen}
                          startContent={<FiEdit3 />}
                          className="font-medium shadow-sm"
                        >
                          Create Your First Post
                        </Button>
                      </div>
                    ) : (
                      posts.map((post) => (
                        <Post
                          key={post._id}
                          post={post}
                          getAllPosts={() =>
                            queryClient.invalidateQueries(["userPosts", userData?._id])
                          }
                        />
                      ))
                    )}
                  </div>
                </Tab>

                {/* ----------------- 2. ABOUT TAB ----------------- */}
                <Tab
                  key="about"
                  title={
                    <div className="flex items-center gap-1.5">
                      <FiUser className="text-base sm:text-lg" />
                      <span>About</span>
                    </div>
                  }
                >
                  <div className="mt-4 space-y-5">
                    {/* Bento Card 1: Personal Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Account and contact details on Nexify
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          startContent={<BsPencil size={13} />}
                          onPress={onEditOpen}
                        >
                          Edit
                        </Button>
                      </div>

                      {/* 8-item Info Grid with signature pastel pills */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100/60">
                          <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <FiUser className="text-lg" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs text-gray-400 font-medium block">
                              Full Name
                            </span>
                            <span className="text-sm font-semibold text-gray-800 truncate block">
                              {userData?.name || "User"}
                            </span>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100/60">
                          <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                            <FiMail className="text-lg" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs text-gray-400 font-medium block">Email</span>
                            <span className="text-sm font-semibold text-gray-800 truncate block">
                              {userData?.email || "user@example.com"}
                            </span>
                          </div>
                        </div>

                        {/* Gender */}
                        <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100/60">
                          <div className="size-10 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center shrink-0">
                            <FaVenusMars className="text-lg" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs text-gray-400 font-medium block">Gender</span>
                            <span className="text-sm font-semibold text-gray-800 capitalize block">
                              {userData?.gender === "female" ? "Female" : "Male"}
                            </span>
                          </div>
                        </div>

                        {/* Birthday */}
                        <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100/60">
                          <div className="size-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                            <FiCalendar className="text-lg" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs text-gray-400 font-medium block">
                              Birth Date
                            </span>
                            <span className="text-sm font-semibold text-gray-800 truncate block">
                              {formatBirthDate(userData?.dateOfBirth)}
                            </span>
                          </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100/60">
                          <div className="size-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                            <FiBriefcase className="text-lg" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs text-gray-400 font-medium block">
                              Profession / Role
                            </span>
                            <span className="text-sm font-semibold text-gray-800 truncate block">
                              {profileData.role}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100/60">
                          <div className="size-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                            <FiMapPin className="text-lg" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs text-gray-400 font-medium block">
                              Location
                            </span>
                            <span className="text-sm font-semibold text-gray-800 truncate block">
                              {profileData.location}
                            </span>
                          </div>
                        </div>

                        {/* Joined Date */}
                        <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100/60">
                          <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                            <FiClock className="text-lg" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs text-gray-400 font-medium block">
                              Member Since
                            </span>
                            <span className="text-sm font-semibold text-gray-800 truncate block">
                              {formatJoinedDate(userData?.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Website */}
                        <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100/60">
                          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                            <FiGlobe className="text-lg" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs text-gray-400 font-medium block">Website</span>
                            <a
                              href={
                                profileData.website.startsWith("http")
                                  ? profileData.website
                                  : `https://${profileData.website}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-semibold text-blue-600 hover:underline truncate block"
                            >
                              {profileData.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bento Card 2: Skills & Stack */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-5 sm:p-6">
                      <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                          Skills & Tech Expertise
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Technologies and capabilities featured on this profile
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        {SKILLS_LIST.map((skill) => (
                          <span
                            key={skill.name}
                            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition shadow-xs hover:scale-105 duration-200 cursor-default ${skill.bg}`}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bento Card 3: Bio Quote */}
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50/50 rounded-2xl p-5 sm:p-6 border border-blue-100">
                      <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <span>Engineering Mindset</span>
                      </h3>
                      <blockquote className="text-sm text-gray-700 italic leading-relaxed">
                        "{profileData.bio}"
                      </blockquote>
                    </div>
                  </div>
                </Tab>

                {/* ----------------- 3. FRIENDS TAB ----------------- */}
                <Tab
                  key="friends"
                  title={
                    <div className="flex items-center gap-1.5">
                      <FaUserFriends className="text-base sm:text-lg" />
                      <span>Friends</span>
                      <span className="hidden sm:inline px-1.5 py-0.2 text-xs rounded-full bg-gray-100 text-gray-600 font-semibold">
                        {SAMPLE_FRIENDS.length}
                      </span>
                    </div>
                  }
                >
                  <div className="mt-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">Friends & Connections</h2>
                          <p className="text-xs text-gray-500 mt-0.5">
                            People you interact with on Nexify
                          </p>
                        </div>
                        <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
                          See All ({SAMPLE_FRIENDS.length})
                        </span>
                      </div>

                      {/* Friends Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SAMPLE_FRIENDS.map((friend) => (
                          <div
                            key={friend.id}
                            className="p-4 rounded-xl border border-gray-200/80 hover:border-blue-300 hover:shadow-md transition duration-200 flex flex-col justify-between bg-white"
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative shrink-0">
                                <img
                                  src={friend.avatar}
                                  alt={friend.name}
                                  className="size-12 rounded-full object-cover"
                                />
                                {friend.online && (
                                  <span
                                    className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-white rounded-full"
                                    title="Online now"
                                  />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-sm text-gray-900 truncate">
                                  {friend.name}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">{friend.role}</p>
                                <p className="text-[11px] text-gray-400 mt-1">
                                  {friend.mutual} mutual friends
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                              <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                className="flex-1 text-xs font-medium cursor-pointer"
                                onPress={() => toast.info(`Starting chat with ${friend.name}`)}
                              >
                                Message
                              </Button>
                              <Button
                                size="sm"
                                variant="bordered"
                                className="text-xs font-medium border-gray-200 text-gray-600 cursor-pointer"
                                onPress={() => toast.info(`Viewing ${friend.name}'s profile`)}
                              >
                                Profile
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab>

                {/* ----------------- 4. PHOTOS TAB ----------------- */}
                <Tab
                  key="photos"
                  title={
                    <div className="flex items-center gap-1.5">
                      <IoMdPhotos className="text-base sm:text-lg" />
                      <span>Photos</span>
                      <span className="hidden sm:inline px-1.5 py-0.2 text-xs rounded-full bg-gray-100 text-gray-600 font-semibold">
                        {postPhotos.length}
                      </span>
                    </div>
                  }
                >
                  <div className="mt-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-5 sm:p-6">
                      <div className="mb-5 pb-3 border-b border-gray-100 flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">Photos & Media</h2>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Visual moments posted by {userData?.name || "you"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          startContent={<FiEdit3 />}
                          onPress={onCreateOpen}
                        >
                          Add Photo
                        </Button>
                      </div>

                      {postPhotos.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="size-14 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-2xl mb-3">
                            <IoMdPhotos />
                          </div>
                          <p className="text-sm font-semibold text-gray-700">No photos uploaded yet</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Share photos with your posts to see them in your gallery.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {postPhotos.map((photo) => (
                            <div
                              key={photo.id}
                              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer shadow-xs border border-gray-200/60"
                            >
                              <img
                                src={photo.src}
                                alt="Post media"
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                                <p className="text-white text-xs truncate drop-shadow-md">
                                  {photo.body || "Post Photo"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserProfileModal
        isOpen={isPassOpen}
        onOpen={onPassOpen}
        onOpenChange={onPassOpenChange}
      />

      <EditProfileModal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        initialData={{
          name: userData?.name,
          email: userData?.email,
          role: profileData.role,
          location: profileData.location,
          bio: profileData.bio,
          website: profileData.website,
        }}
        onSave={(updated) => {
          setProfileData(updated);
        }}
      />

      <CreatePostModal
        callback={() => queryClient.invalidateQueries(["userPosts", userData?._id])}
        isOpen={isCreateOpen}
        onOpenChange={onCreateOpenChange}
      />
    </div>
  );
}
