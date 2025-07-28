import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaBook, FaSignOutAlt, FaClipboardList} from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { logoutUser } from '../../api/users';

const FloatingNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { path: '/', icon: <FaHome size={20} />, label: 'Home' },
    { path: '/list', icon: <FaClipboardList size={20} />, label: 'List' },
    { path: '/class', icon: <FaBook size={20} />, label: 'Class' },
    { path: '/student', icon: <FaUserGraduate size={20} />, label: 'Students' },
    { path: '/teacher', icon: <FaChalkboardTeacher size={20} />, label: 'Teachers' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-full border border-gray-200 z-50 px-4 py-2 flex flex-wrap items-center">
      <div className="flex space-x-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center p-2 rounded-full ${
                isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="flex items-center">
        <div className="h-8 w-px bg-gray-300 mx-4"></div>
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
        >
          <FaSignOutAlt size={20} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingNav;