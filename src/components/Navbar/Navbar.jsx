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
import navLogo from "../../assets/images/logo.png"
import { useContext } from "react";
import { authContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {

  const { token, setToken, userData, isLoading } = useContext(authContext)
  const navigate = useNavigate()

  function logoutUser() {
    localStorage.removeItem("userToken")
    setToken(false)
    navigate("/login")
  }


  return (
    <HeroNavbar isBordered maxWidth="full" className="px-16">
      <NavbarContent justify="start">
        <Link to={"/home"}>
          <NavbarBrand className="mr-4">
            <img width={45} src={navLogo} alt="Logo" />
            <span className="font-bold ms-2 text-2xl">Nexify</span>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarBrand>
        <Input
          classNames={{
            base: "max-w-full h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          radius="full"
          type="search"
        />
      </NavbarBrand>

      <NavbarContent as="div" className="items-center" justify="end">

        <NavbarItem className="bg-gray-200 size-10 flex justify-center items-center rounded-full">
          <Badge color="danger" content="5">
            <RiMessage2Fill className="text-2xl" />
          </Badge>
        </NavbarItem>
        <NavbarItem className="bg-gray-200 size-10 flex justify-center items-center rounded-full">
          <Badge color="danger" content="5">
            <FaBell className="text-2xl" />
          </Badge>
        </NavbarItem>

        <Dropdown placement="bottom-end">
          <DropdownTrigger className="cursor-pointer">
            {isLoading ? <Skeleton className="shrink-0 flex rounded-full size-10" /> :
            <Avatar
              isBordered
              as="button"
              name={userData.name}
              size="sm"
              src={userData.photo || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
            />
            }
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
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
    </HeroNavbar>
  );
}
