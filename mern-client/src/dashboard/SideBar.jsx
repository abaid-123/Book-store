import React, { useContext } from "react";
import { Sidebar } from "flowbite-react";
import { BiBuoy } from "react-icons/bi";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiOutlineCloudUpload,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import { AuthContext } from "../contects/AuthProvider"; // Import AuthContext to use logOut
import userimg from "../assets/abaid2.png";

const SideBar = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { logOut } = useContext(AuthContext); // Access logOut from Firebase Auth

  // Handle the logout function
  const handleLogout = async () => {
    try {
      // Call the logOut function from Firebase Auth
      await logOut();
      alert("You have been logged out.");

      // After logging out, navigate to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Sidebar
      className="bg-gray-200"
      aria-label="Sidebar with content separator example"
    >
      <Sidebar.Logo
        href="#"
        img={userimg}
        imgAlt="Flowbite logo"
        className="rounded"
      >
        Admin
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            as={Link}
            to="/admin/dashboard"
            className="hover:bg-gray-300"
            icon={HiChartPie}
          >
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            to="/admin/dashboard/upload"
            className="hover:bg-gray-300"
            icon={HiOutlineCloudUpload}
          >
            Upload Books
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            to="/admin/dashboard/manage"
            className="hover:bg-gray-300"
            icon={HiInbox}
          >
            Manage Books
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            to="/user"
            className="hover:bg-gray-300"
            icon={HiUser}
          >
            Users
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            to="/login"
            className="hover:bg-gray-300"
            icon={HiArrowSmRight}
          >
            Sign In
          </Sidebar.Item>

          {/* Handle the log out with a click handler */}
          <Sidebar.Item
            icon={HiTable}
            className="hover:bg-gray-300"
            onClick={handleLogout}
          >
            Log out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SideBar;
