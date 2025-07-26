import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSort, FaSortUp, FaSortDown, FaTimes, FaFilter } from 'react-icons/fa';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Notification from '@/components/ui/Notification';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    name: '',
    nis_student: '',
    id_class: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [filteredStudents, setFilteredStudents] = useState([]);


  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'ascending'
  });

  const fetchStudents = async () => {
    try {
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        sort_by: sortConfig.key,
        sort_order: sortConfig.direction
      };
      
      const res = await axios.get('http://127.0.0.1:8000/api/students', { params });
      setStudents(res.data.data || res.data);
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

  const applyClassFilter = () => {
    if (selectedClassFilter === 'all') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.id_class === parseInt(selectedClassFilter)
      );
      setFilteredStudents(filtered);
    }
  };

  useEffect(() => {
    applyClassFilter();
  }, [students, selectedClassFilter]);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [currentPage, sortConfig]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  const openModal = (student = null) => {
    if (student) {
      setForm({
        name: student.name,
        nis_student: student.nis_student,
        id_class: student.id_class
      });
      setEditingId(student.id);
    } else {
      setForm({
        name: '',
        nis_student: '',
        id_class: ''
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/students/${editingId}`, form);
        showNotification('Student updated successfully', 'success');
      } else {
        await axios.post('http://127.0.0.1:8000/api/students', form);
        showNotification('Student added successfully', 'success');
      }
      fetchStudents();
      closeModal();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const openDeleteConfirm = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/students/${itemToDelete}`);
      showNotification('Student deleted successfully', 'success');
      fetchStudents();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setShowConfirmModal(false);
    }
  };

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    });
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
    <div className="container">
      <Notification {...notification} />

      <div className="flex justify-between items-center mb-4 mt-10">
        <h1 className="text-xl font-bold">Student Management</h1>
        <div className="flex items-center gap-4">
          {/* Tambahkan dropdown filter di sini */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm border">
            <FaFilter className="text-gray-500" />
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="border-none focus:ring-0 focus:outline-none text-sm"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id_class} value={cls.id_class}>
                  {cls.name_class}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add Student
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {filteredStudents.map((student, index) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.nis_student}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {classes.find(c => c.id_class === student.id_class)?.name_class || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    onClick={() => openModal(student)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(student.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setForm({...form, name: value});
                  }}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">NIS</label>
                <input
                  type="text"
                  name="nis_student"
                  value={form.nis_student}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setForm({...form, nis_student: value});
                  }}
                  className="w-full px-3 py-2 border rounded"
                  required
                  pattern="[0-9]*"
                  inputMode="numeric" 
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Class</label>
                <select
                  name="id_class"
                  value={form.id_class}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id_class} value={cls.id_class}>
                      {cls.name_class}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this student?"
      />
    </div>
  );
};

export default Student;