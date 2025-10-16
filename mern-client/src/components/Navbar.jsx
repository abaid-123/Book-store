import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBarsStaggered, FaBlog, FaXmark } from "react-icons/fa6";
import { AuthContext } from "../contects/AuthProvider";

const Navbar = () => {
  const [isOpenmenu, setisOpenmenu] = useState(false);
  const [isSticky, setisSticky] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // to programmatically navigate

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

  const handleSellBooksClick = () => {
    if (user) {
      navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="w-full bg-transparent fixed top-0 right-0 left-0 transition-all ease-in duration-300">
      <nav
        className={`py-4 lg:px-24 px-4 ${isSticky ? "sticky top-0 left-0 right-0 bg-blue-300" : ""}`}
      >
        <div className="flex justify-between items-center text-base gap-8">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <FaBlog className="inline-block" /> books
          </Link>

          {/* Desktop Navigation */}
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
            <button
              onClick={handleSellBooksClick} // Conditionally handle Sell your Books
              className="block text-base text-black uppercase cursor-pointer hover:text-blue-700"
            >
              Sell your Books
            </button>
          </ul>

          {/* Hamburger Menu */}
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

        {/* Mobile Navigation */}
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
          <button
            onClick={handleSellBooksClick}
            className="block text-base text-white uppercase cursor-pointer hover:text-blue-700"
          >
            Sell your Books
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
