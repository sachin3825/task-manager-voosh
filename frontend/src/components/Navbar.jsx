import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTasks, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import InitialsAvatar from 'react-initials-avatar';
import 'react-initials-avatar/lib/ReactInitialsAvatar.css';
import { persistor } from '../store/store';
import { performLogout } from '../store/slices/authSlice';
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(performLogout());
    persistor.purge();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="w-full p-2 bg-blue-500 text-white">
      <nav className="flex w-10/12 mx-auto justify-between items-center">
        <NavLink to={'/dashboard'}>
          <FaTasks color="white" />
        </NavLink>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <div className="relative">
                <button onClick={toggleDropdown} className="flex items-center space-x-2">
                  {user?.avatar ? (
                    <img
                      src={`${user.avatar}?t=${new Date().getTime()}`} // Adding a timestamp to avoid caching
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <InitialsAvatar
                      name={`${user?.firstName || 'User'} ${user?.lastName || ''}`}
                      className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center"
                    />
                  )}

                  <span className="text-white font-semibold">{user?.firstName || 'User'}</span>

                  {dropdownOpen ? (
                    <FaChevronUp className="text-white" />
                  ) : (
                    <FaChevronDown className="text-white" />
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <NavLink
                to={'/login'}
                className={({ isActive, isPending }) =>
                  isPending
                    ? ''
                    : isActive
                      ? 'bg-white text-blue-400 px-2 py-1 rounded-md'
                      : 'px-2 py-1'
                }
              >
                Login
              </NavLink>
              <NavLink
                to={'/signup'}
                className={({ isActive, isPending }) =>
                  isPending
                    ? ''
                    : isActive
                      ? 'bg-white text-blue-400 px-2 py-1 rounded-md'
                      : 'px-2 py-1'
                }
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
