import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTasks } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="w-full p-2 bg-blue-400 text-white">
      <nav className="flex w-10/12 mx-auto justify-between items-center">
        <FaTasks color="white" />
        <div>
          <div className="flex flex-1 gap-2">
            {token ? (
              <button
                onClick={handleLogout}
                className="bg-white text-blue-400 px-2 py-1 rounded-md"
              >
                Logout
              </button>
            ) : (
              <>
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
                  SignUp
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
