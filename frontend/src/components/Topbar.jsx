import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import img from "../assets/logo.png";
import { generateAvatar } from "../utils/avatarUtils";

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [featureOpen, setFeatureOpen] = useState(false);

  const dropdownRef = useRef();
  const featureRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (featureRef.current && !featureRef.current.contains(e.target)) {
        setFeatureOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img src={img} alt="Logo" className="h-9 w-auto" />
        </div>

        {/* CENTER NAV */}
        <div className="hidden md:flex gap-6 ml-auto text-lg font-medium text-gray-600">

          <button
            onClick={() => navigate("/about")}
            className="hover:text-[#a90006] "
          >
            About
          </button>

          {/* FEATURES DROPDOWN */}
          <div className="relative" ref={featureRef}>
            <button
              onClick={() => setFeatureOpen(!featureOpen)}
              className="hover:text-red-600 flex items-center gap-1"
            >
              Features 
            </button>

            {featureOpen && (
              <div className="absolute top-10 left-0 w-44 bg-white border rounded-xl shadow-lg py-2">
                <button onClick={() => navigate("/seo")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  📈 SEO
                </button>
                <button onClick={() => navigate("/aeo")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  🤖 AEO
                </button>
                <button onClick={() => navigate("/geo")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  🌍 GEO
                </button>
              </div>
            )}
          </div>

          {/* OTHER LINKS */}
          <button
            onClick={() => navigate("/pricing")}
            className={`hover:text-red-600 ${
              location.pathname === "/pricing" && "text-red-600"
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="hover:text-[#a90006]"
          >
            Contact
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-3">

          {/* NOT LOGGED */}
          {!user && (
              <button
                onClick={() => navigate("/login")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Get Started
              </button>
           
          )}

          {/* LOGGED IN */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setOpen(!open)}
                className="cursor-pointer"
              >
                <img
                  src={generateAvatar(user?.name)}
                  alt="avatar"
                  className="w-9 h-9 rounded-full"
                />
              </div>

              {open && (
                <div className="absolute right-0 translate-x-3 mt-3 w-52 bg-white border rounded-xl shadow-xl py-2">

                  <div className="px-4 py-2 border-b flex items-center gap-2">
                    <img
                      src={generateAvatar(user?.name)}
                      alt="avatar"
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {user?.name}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const profilePath = user?.role === "admin" ? "/admin" : "/profile";
                      navigate(profilePath);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    👤 Profile
                  </button>

                  <button
                    onClick={() => navigate("/settings")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    ⚙️ Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Topbar;