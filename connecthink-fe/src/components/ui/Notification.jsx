// components/ui/Notification.jsx
import { FaCheck, FaTimes } from 'react-icons/fa';

const Notification = ({ show, message, type }) => {
  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      type === 'success' 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <FaCheck className="mr-2" />
        ) : (
          <FaTimes className="mr-2" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;