import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSort, FaSortUp, FaSortDown, FaTimes, FaFilter } from 'react-icons/fa';
import Notification from '@/components/ui/Notification';
import { useNavigate } from 'react-router-dom';

const ViewStudent = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'ascending'
  });

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
      };
  
      const res = await axios.get('http://127.0.0.1:8000/api/students', { params });
  
      let rawData = res.data.data || res.data;

      const sorted = [...rawData].sort((a, b) => {
        const key = sortConfig.key;
  
        if (!key) return 0; 
        if (typeof a[key] === 'string') {
          return sortConfig.direction === 'asc'
            ? a[key].localeCompare(b[key])
            : b[key].localeCompare(a[key]);
        } else {
          return sortConfig.direction === 'asc'
            ? a[key] - b[key]
            : b[key] - a[key];
        }
      });

      setStudents(sorted);
      setTotalItems(res.data.total || res.data.length);
    } catch (err) {
      showNotification('Failed to load students', 'error');
    }
  };
  

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/class');
      setClasses(res.data);
    } catch (err) {
      showNotification('Failed to load classes', 'error');
    }
  };



  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  const requestSort = (key) => {
    const direction = 
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
  
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [currentPage, sortConfig]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="container">
      <Notification {...notification} />

      <div className="flex justify-between items-center mb-4 mt-10">
        <h1 className="text-xl font-bold">View Students From Classes</h1>
        <button 
          onClick={() => navigate('/students/manage')}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          Manage Student
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => requestSort('name_class')}
              >
                <div className="flex items-center">
                  Class
                  <span className="ml-1">{getSortIcon('name_class')}</span>
                </div>
              </th>
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
                onClick={() => requestSort('nis_student')}
              >
                <div className="flex items-center">
                  NIS
                  <span className="ml-1">{getSortIcon('nis_student')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
  {Object.entries(
    students.reduce((acc, student) => {
      const className = classes.find(cls => cls.id_class === student.id_class)?.name_class || 'Unknown';
      if (!acc[className]) acc[className] = [];
      acc[className].push(student);
      return acc;
    }, {})
  ).map(([className, studentList]) =>
    studentList.map((student, idx) => (
      <tr key={student.id}>
        <td className="px-6 py-4 whitespace-nowrap">
          {(currentPage - 1) * itemsPerPage + idx + 1}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {idx === 0 ? className : ''}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
        <td className="px-6 py-4 whitespace-nowrap">{student.nis_student}</td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} students
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200' : 'bg-gray-300 hover:bg-gray-400'}`}
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
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200' : 'bg-gray-300 hover:bg-gray-400'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
