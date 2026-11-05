import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useLayoutStore from "../store/layoutStore";
import useThemeStore from "../store/themeStore";
import useUserStore from "../store/useUserStore";
import {
  FaRocketchat,
  FaUser,
} from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { motion } from "framer-motion";

const SideBar = () => {
  const { selectedContact } = useLayoutStore();
  const { activeTab, setActiveTab } = useLayoutStore();
  const { theme } = useThemeStore();
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("chats");
    } else if (location.pathname === "/status") {
      setActiveTab("status");
    } else if (location.pathname === "/user-profile") {
      setActiveTab("profile");
    } else if (location.pathname === "/setting") {
      setActiveTab("setting");
    }
  }, [location.pathname, setActiveTab]);

  if (isMobile && selectedContact) {
    return null;
  }

  const iconClass = (tab) => `
    w-6 h-6
    ${
      activeTab === tab
        ? "text-gray-800"
        : theme === "dark"
          ? "text-gray-300"
          : "text-gray-800"
    }
  `;

  const linkClass = (tab) => `
    flex items-center justify-center
    rounded-full p-2
    ${isMobile ? "" : "mb-8"}
    ${
      activeTab === tab
        ? "bg-gray-300 shadow-sm"
        : "hover:bg-gray-300/50"
    }
  `;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        ${
          isMobile
            ? "fixed bottom-0 left-0 right-0 h-16 z-40"
            : "w-16 h-screen border-r-2"
        }
        ${
          theme === "dark"
            ? "bg-gray-800 border-gray-600"
            : "bg-[rgb(239,242,254)] border-gray-300"
        }
        flex items-center py-4 shadow-lg
        ${
          isMobile
            ? "flex-row justify-around"
            : "flex-col justify-between"
        }
      `}
    >
      <Link to="/" className={linkClass("chats")}>
        <FaRocketchat className={iconClass("chats")} />
      </Link>

      <Link to="/status" className={linkClass("status")}>
        <MdOutlineRadioButtonChecked
          className={iconClass("status")}
        />
      </Link>

      <Link
        to="/user-profile"
        className={linkClass("profile")}
        aria-label="Profile"
      >
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
            <FaUser className="text-gray-600 text-sm" />
          </div>
        )}
      </Link>

      <Link to="/setting" className={linkClass("setting")}>
        <IoSettings className={iconClass("setting")} />
      </Link>

      {!isMobile && <div className="flex-grow" />}
    </motion.div>
  );
};

export default SideBar;