"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth, usePermissions } from "@/hooks/useAuth";
import { Person, AdminPanelSettings, Create } from "@mui/icons-material";
import { motion } from "motion/react";

const NavBar: React.FC = () => {
  interface NavElements {
    name: string;
    color: string;
    path: string;
    requiredRole?: "admin" | "creator" | "user";
  }

  const router = useRouter();
  const { isAuthenticated, user, role, isLoading } = useAuth();
  const permissions = usePermissions();

  const [selectedItem, setSelectedItem] = useState<string>("MODELS");
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const navItems: NavElements[] = [
    { name: "HOME", color: "#00bfff", path: "" },
    { name: "MODELS", color: "#00bfff", path: "/" },
    { name: "SCENES", color: "#00bfff", path: "/" },
    { name: "INTROS", color: "#00bfff", path: "/screens" },
    { name: "CHARACTERS", color: "#00bfff", path: "" },
    // Admin
    { name: "ADMIN", color: "#dc2626", path: "/admin", requiredRole: "admin" },
    // Creator
    {
      name: "CREATE",
      color: "#059669",
      path: "/create",
      requiredRole: "creator",
    },
  ];

  const visibleNavItems = navItems.filter((item) => {
    if (!item.requiredRole) return true;
    if (!isAuthenticated) return false;

    const roleHierarchy = { admin: 3, creator: 2, user: 1 };
    const userLevel = roleHierarchy[role] || 0;
    const requiredLevel = roleHierarchy[item.requiredRole] || 0;

    return userLevel >= requiredLevel;
  });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      handleResize();
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleItemClick = (item: NavElements) => {
    setSelectedItem(item.name);
    setClickedItem(item.name);
    setTimeout(() => setClickedItem(null), 300);
    router.push(item.path);
    setIsMenuOpen(false);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.username || user.email.split("@")[0];
  };

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return <AdminPanelSettings className="w-4 h-4 text-red-600" />;
      case "creator":
        return <Create className="w-4 h-4 text-green-600" />;
      default:
        return <Person className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "creator":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const buttonAnimation = {};

  return (
    <div className="flex flex-col md:flex-row">
      <motion.nav
        initial={{
          scaleX: 0,
          opacity: 0,
          transformOrigin: "left center",
        }}
        animate={
           {
                scaleX: 1,
                opacity: 1,
              }
      
        }
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth roll
          type: "tween",
        }}
        className="flex flex-col md:flex-row justify-between relative w-full bg-[#d6e9fa] shadow-xl "
        style={{
          boxShadow:
            "0 6px 12px rgba(0, 0, 0, 0.1), inset 0 -4px 4px rgba(0, 0, 0, 0.1), inset 0 4px 4px rgba(255, 255, 255, 0.5)",
        }}
      >
        <div className="flex justify-between items-center p-4 md:p-0">
          <div
            className="relative  h-full cursor-pointer"
            onClick={() => router.push("/")}
            style={{
              backgroundColor: "#00bfff",
              boxShadow: `0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 4px rgba(0, 0, 0, 0.4), inset 0 4px 4px rgba(255, 255, 255, 0.7)`,
            }}
          >
            <Image
              className="w-20 h-full p-2 rounded-xl"
              src={"/fallback.jpg"}
              alt="loading"
              width={80}
              height={80}
            />
          </div>

          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-4  text-white bg-blue-500 rounded"
            >
              ☰
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <ul
          className={`flex flex-col md:flex-row justify-start md:ml-7 p-3 gap-4 items-center relative z-10 ${
            isMobile && !isMenuOpen ? "hidden" : "flex"
          }`}
        >
          {visibleNavItems.map((item) => (
            <li key={item.name} className="w-full md:w-auto">
              <motion.button
                initial={{
                  x: viewport.width + 1000, // Use viewport state instead of window.innerWidth
                  y: 500,
                  scale: 0.6,
                  rotate: -360,
                }}
                animate={{
                  // X creates the C-shape horizontally - using relative positioning
                  x: [
                    viewport.width + 1000, // 1. Start outside right
                    viewport.width * 0.3, // 2. Come to middle-right
                    -viewport.width * 1.9, // 3. EXTREME LEFT (80% of screen width to the left)
                    -viewport.width * 2.8,
                    -viewport.width * 2.9, // 4. Start curving back from extreme left
                    0, // 5. Final position (relative to navbar)
                  ],
                  // Y creates the vertical C-curve
                  y: [
                    500, // 1. Start high
                    600, // 2. Drop while moving left
                    550, // 3. Bottom of C-curve (lowest point)
                    350, // 4. Curve back up
                    150,
                    0, // 5. Final navbar position
                  ],
                  scale: [0.6, 0.6, 1.1, 1.05, 1,1],
                }}
                transition={{
                  duration: 2.5,
                  type:"keyframes",
                  ease:"linear", // Custom easing for smooth curve
                  // times: [0, 0.5, 1, 1.5,2.0, 2.5], // Control timing of each keyframe
                  delay:
                    visibleNavItems.findIndex((el) => el.name === item.name) *
                    0.03,
                }}
                className={`relative px-6 py-3 rounded-xl z-1 text-white hover:scale-110 font-bold text-lg transition-all duration-200 transform active:scale-90 focus:scale-100 ease-in-out group w-full md:w-auto ${
                  selectedItem === item.name
                    ? "text-[#ffffff]"
                    : "hover:text-[#ffffff]"
                } ${clickedItem === item.name ? "animate-click" : ""}`}
                style={{
                  backgroundColor: item.color,
                  boxShadow:
                    selectedItem === item.name
                      ? `0 2px 0px rgba(0, 0, 0, 0.01), inset 0 -4px 2px rgba(0, 0, 0, 0.02), inset 0 4px 4px rgba(255, 255, 255, 0.2)`
                      : `0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 4px rgba(0, 0, 0, 0.4), inset 0 4px 4px rgba(255, 255, 255, 0.7)`,
                }}
                onClick={() => handleItemClick(item)}
              >
                <span className="relative z-10">{item.name}</span>
                {selectedItem !== item.name && (
                  <span
                    className="absolute inset-0 transform scale-x-0"
                    style={{
                      background: item.color,
                      boxShadow: `0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 4px rgba(0, 0, 0, 0.4), inset 0 4px 4px rgba(255, 255, 255, 0.7)`,
                    }}
                  ></span>
                )}
              </motion.button>
            </li>
          ))}
        </ul>

        {/* Authentication Section */}
        <div className="flex items-center gap-4 p-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* User Role Badge */}
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor()}`}
              >
                {getRoleIcon()}
                <span className="capitalize">{role}</span>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={handleUserMenuClick}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  <Person className="w-4 h-4" />
                  <span className="hidden md:inline">
                    {getUserDisplayName()}
                  </span>
                  <span className="text-xs">▼</span>
                </button>

                {/* Dropdown Menu */}
                {userMenuAnchor && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          router.push("/profile");
                          handleUserMenuClose();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Profile Settings
                      </button>
                      {permissions.isAdmin && (
                        <button
                          onClick={() => {
                            router.push("/admin/dashboard");
                            handleUserMenuClose();
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Admin Dashboard
                        </button>
                      )}
                      <div className="border-t border-gray-200 my-1"></div>
                      {/* <LogoutButton 
                        className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded" 
                        showIcon={false}
                      /> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              {/* <button
                className="relative px-4 py-2 text-white font-bold text-sm transition-all duration-300 ease-in-out overflow-hidden group rounded-lg"
                style={{
                  backgroundColor: "#00bfff",
                  boxShadow: `0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 4px rgba(0, 0, 0, 0.4), inset 0 4px 4px rgba(255, 255, 255, 0.7)`,
                }}
                onClick={() => router.push('/login')}
              >
                <span className="relative z-10">LOGIN</span>
              </button> */}

              <button
                className="relative px-4 py-2 text-blue-600 font-bold text-sm transition-all duration-300 ease-in-out border-2 border-blue-500 rounded-lg hover:bg-blue-50"
                onClick={() => router.push("/register")}
              >
                REGISTER
              </button>
            </div>
          )}
        </div>

        {/* Click outside to close user menu */}
        {userMenuAnchor && (
          <div
            className="fixed inset-0 z-40"
            onClick={handleUserMenuClose}
          ></div>
        )}
      </motion.nav>
    </div>
  );
};

export default NavBar;
