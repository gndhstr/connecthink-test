import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSort, FaSortUp, FaSortDown, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Notification from '@/components/ui/Notification';

const ViewTeacher = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'ascending'
  });

  const fetchTeachers = async () => {
    try {
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        sort_by: sortConfig.key,
        sort_order: sortConfig.direction
      };
      
      const res = await axios.get('http://127.0.0.1:8000/api/teacher', { params });
      setTeachers(res.data.data || res.data);
      setTotalItems(res.data.total || res.data.length);
    } catch (err) {
      console.error('Error fetching teachers', err);
      showNotification('Gagal memuat data Teacher', 'error');
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/class');
      setClasses(res.data);
    } catch (err) {
      console.error('Error fetching classes', err);
      showNotification('Gagal memuat data kelas', 'error');
    }
  };


  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, [currentPage, sortConfig]);

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mt-10">
      <Notification 
        show={notification.show} 
        message={notification.message} 
        type={notification.type} 
      />

      <div className="flex justify-between items-center mb-4 mt-10">
        <h1 className="text-xl font-bold">View Teachers From Classes</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/teachers/manage')}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            Manage Teacher
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center">
                  Name
                  <span className="ml-1">{getSortIcon('name')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => requestSort('nip_teacher')}
              >
                <div className="flex items-center">
                  NIP
                  <span className="ml-1">{getSortIcon('nip_teacher')}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Clasess
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id_teacher}>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.nip_teacher}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.class_relation?.class_detail?.name_class || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} from {totalItems} data
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
          >
            Previous
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTeacher;