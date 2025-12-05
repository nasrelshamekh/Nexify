import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Badge,
  Skeleton,
} from "@heroui/react";
import { RiMessage2Fill } from "react-icons/ri";
import { FaBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import navLogo from "../../assets/images/logo.png"
import { useContext, useState } from "react";
import { authContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {

  const { token, setToken, userData, isLoading } = useContext(authContext)
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false);

  function logoutUser() {
    localStorage.removeItem("userToken")
    setToken(false)
    navigate("/login")
  }


  return (
    <HeroNavbar 
      isBordered 
      maxWidth="full" 
      className="px-3 sm:px-6 md:px-10 lg:px-16"
    >
      {/* Left Section - Logo */}
      <NavbarContent justify="start" className="gap-2 sm:gap-4">
        <Link to={"/home"}>
          <NavbarBrand className="mr-0 sm:mr-4">
            <img width={35} className="sm:w-[45px]" src={navLogo} alt="Logo" />
            <span className="font-bold ms-1 sm:ms-2 text-lg sm:text-2xl">Nexify</span>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      {/* Center Section - Search (Desktop only) */}
      <NavbarContent className="hidden lg:flex flex-1" justify="center">
        <Input
          classNames={{
            base: "w-full h-10",
            mainWrapper: "h-full w-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          radius="full"
          type="search"
        />
      </NavbarContent>

      {/* Right Section - Icons and Profile */}
      <NavbarContent as="div" className="items-center gap-2 sm:gap-4" justify="end">
        
        {/* Search Icon (Mobile/Tablet only) */}
        <NavbarItem className="lg:hidden">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="bg-gray-200 size-9 sm:size-10 flex justify-center items-center rounded-full"
          >
            <FiSearch className="text-lg sm:text-xl" />
          </button>
        </NavbarItem>

        {/* Messages */}
        <NavbarItem className="bg-gray-200 size-9 sm:size-10 flex justify-center items-center rounded-full">
          <Badge color="danger" content="5" size="sm">
            <RiMessage2Fill className="text-lg sm:text-2xl" />
          </Badge>
        </NavbarItem>

        {/* Notifications */}
        <NavbarItem className="bg-gray-200 size-9 sm:size-10 flex justify-center items-center rounded-full">
          <Badge color="danger" content="5" size="sm">
            <FaBell className="text-lg sm:text-2xl" />
          </Badge>
        </NavbarItem>

        {/* User Dropdown */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger className="cursor-pointer">
            {isLoading ? <Skeleton className="shrink-0 flex rounded-full size-8 sm:size-10" /> :
            <Avatar
              isBordered
              as="button"
              name={userData.name}
              size="sm"
              className="w-8 h-8 sm:w-10 sm:h-10"
              src={userData.photo || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
            />
            }
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2" textValue={`Signed in as ${userData.email}`}>
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{userData.email}</p>
            </DropdownItem>
            <DropdownItem as={Link} to="/profile" key="profile-page">My Profile</DropdownItem>
            <DropdownItem onClick={() => { logoutUser() }} key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Mobile Search Bar (Collapsible) */}
      {showSearch && (
        <NavbarContent className="lg:hidden absolute top-full left-0 right-0 p-3 bg-white border-b z-50">
          <Input
            classNames={{
              base: "max-w-full h-10",
              mainWrapper: "h-full w-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            radius="full"
            type="search"
            autoFocus
          />
        </NavbarContent>
      )}
    </HeroNavbar>
  );
}