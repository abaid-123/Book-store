import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HiArrowSmRight,
  HiChartPie,
  HiChatAlt2,
  HiInbox,
  HiOutlineCloudUpload,
  HiHome,
  HiKey,
  HiTag,
  HiUserGroup,
} from "react-icons/hi";
import { FaBlog } from "react-icons/fa6";
import { AuthContext } from "../contects/AuthProvider";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-600 text-white shadow-sm"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

const SideBar = () => {
  const navigate = useNavigate();
  const { logOut, user } = useContext(AuthContext);
  const initial = (user?.displayName || user?.email || "A")
    .trim()
    .charAt(0)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <aside className="w-full md:w-64 md:sticky md:top-0 md:h-screen bg-slate-900 text-white flex flex-col shrink-0">
      <div className="px-5 py-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-lg font-bold">
          <FaBlog className="text-blue-400" />
          <span>Book Store</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Admin console</p>
      </div>

      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
        <div className="w-10 h-10 rounded-full bg-blue-600 font-bold flex items-center justify-center">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate">Admin</p>
          <p className="text-xs text-slate-400 truncate">
            {user?.email || "admin@gmail.com"}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink to="/admin/dashboard" end className={linkClass}>
          <HiChartPie className="w-5 h-5" />
          Overview
        </NavLink>
        <NavLink to="/admin/dashboard/upload" className={linkClass}>
          <HiOutlineCloudUpload className="w-5 h-5" />
          Upload book
        </NavLink>
        <NavLink to="/admin/dashboard/manage" className={linkClass}>
          <HiInbox className="w-5 h-5" />
          Manage books
        </NavLink>
        <NavLink to="/admin/dashboard/categories" className={linkClass}>
          <HiTag className="w-5 h-5" />
          Categories
        </NavLink>
        <NavLink to="/admin/dashboard/reviews" className={linkClass}>
          <HiChatAlt2 className="w-5 h-5" />
          Manage reviews
        </NavLink>
        <NavLink to="/admin/dashboard/users" className={linkClass}>
          <HiUserGroup className="w-5 h-5" />
          Users
        </NavLink>
        <NavLink to="/admin/dashboard/password" className={linkClass}>
          <HiKey className="w-5 h-5" />
          Change password
        </NavLink>
        <NavLink to="/shop" className={linkClass}>
          <HiHome className="w-5 h-5" />
          View shop
        </NavLink>
      </nav>

      <div className="px-3 py-4 border-t border-slate-800 mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-500"
        >
          <HiArrowSmRight className="w-5 h-5" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
