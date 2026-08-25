import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBarsStaggered, FaBlog, FaXmark } from "react-icons/fa6";
import { AuthContext } from "../contects/AuthProvider";

const Navbar = () => {
  const [isOpenmenu, setisOpenmenu] = useState(false);
  const [isSticky, setisSticky] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const togglemenu = () => {
    setisOpenmenu(!isOpenmenu);
  };

  useEffect(() => {
    const handescroll = () => {
      if (window.scrollY > 100) {
        setisSticky(true);
      } else {
        setisSticky(false);
      }
    };

    window.addEventListener("scroll", handescroll);

    return () => {
      window.removeEventListener("scroll", handescroll);
    };
  }, []);

  const navItem = [
    { link: "Home", path: "/" },
    { link: "About", path: "/about" },
    { link: "Shop", path: "/shop" },
    { link: "contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <header className="w-full bg-teal-100 fixed top-0 right-0 left-0 z-50 transition-all ease-in duration-300">
      <nav
        className={`py-4 lg:px-24 px-4 ${isSticky ? "bg-blue-300" : "bg-teal-100"}`}
      >
        <div className="flex justify-between items-center text-base gap-8">
          <Link to="/" className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <FaBlog className="inline-block" /> books
          </Link>

          <ul className="md:flex space-x-12 hidden">
            {navItem.map(({ link, path }) => (
              <Link
                key={path}
                to={path}
                className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
              >
                {link}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/account"
                  className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
                >
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
              >
                Login
              </Link>
            )}
          </ul>

          <div className="md:hidden">
            <button onClick={togglemenu} className="text-black focus:outline-none">
              {isOpenmenu ? (
                <FaXmark className="w-5 h-5 text-black" />
              ) : (
                <FaBarsStaggered className="w-5 h-5 text-black" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`space-y-4 px-4 mt-16 py-7 bg-blue-700 
            ${isOpenmenu ? "block fixed top-0 right-0 left-0" : "hidden"}`}
        >
          {navItem.map(({ link, path }) => (
            <Link
              key={path}
              to={path}
              className="block text-base text-white uppercase cursor-pointer hover:text-blue-700"
            >
              {link}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/account"
                className="block text-base text-white uppercase cursor-pointer"
              >
                Account
              </Link>
              <button
                onClick={handleLogout}
                className="block text-base text-white uppercase cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-base text-white uppercase cursor-pointer"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
