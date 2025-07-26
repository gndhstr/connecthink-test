import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSort, FaSortUp, FaSortDown, FaTimes } from 'react-icons/fa';
import Notification from '@/components/ui/Notification';
import ConfirmModal from '@/components/ui/ConfirmModal';

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [nameClass, setNameClass] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  
  const fetchStudentsByClass = async (classId) => {
      try {
          const res = await axios.get(`http://127.0.0.1:8000/api/class/${classId}/students`);
          setStudents(res.data.data);
          setShowStudentModal(true);
      } catch (err) {
          showNotification('Gagal memuat data siswa', 'error');
      }
  };
  
  const fetchTeachersByClass = async (classId) => {
      try {
          const res = await axios.get(`http://127.0.0.1:8000/api/class/${classId}/teachers`);
          setTeachers(res.data.data);
          setShowTeacherModal(true);
      } catch (err) {
          showNotification('Gagal memuat data guru', 'error');
      }
  };
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '' 
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const [sortConfig, setSortConfig] = useState({
    key: 'name_class',
    direction: 'ascending'
  });

  const fetchClasses = async () => {
    try {
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        sort_by: sortConfig.key,
        sort_order: sortConfig.direction
      };
      
      const res = await axios.get('http://127.0.0.1:8000/api/class', { params });
      setClasses(res.data.data || res.data);
      setTotalItems(res.data.total || res.data.length);
    } catch (err) {
      console.error('Error fetching classes', err);
      showNotification('Error loading class data', 'error');
    }
  };

  useEffect(() => {
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

  const openModal = (item = null) => {
    if (item) {
      setNameClass(item.name_class);
      setEditingId(item.id_class);
    } else {
      setNameClass('');
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!nameClass.trim()) {
        showNotification('Nama kelas tidak boleh kosong', 'error');
        return;
      }
      
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/class/${editingId}`, {
          name_class: nameClass,
        });
        showNotification('Class successfuly updated', 'success');
      } else {
        await axios.post('http://127.0.0.1:8000/api/class', {
          name_class: nameClass,
        });
        showNotification('Class successfuly added', 'success');
      }
      fetchClasses();
      closeModal();
    } catch (err) {
      console.error('Error saving data', err);
      showNotification('Gagal menyimpan data kelas', 'error');
    }
  };

  const openDeleteConfirm = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/class/${itemToDelete}`);
      showNotification('Delete success', 'success');
      fetchClasses();
    } catch (err) {
      console.error('Error deleting data', err);
      showNotification('Delete failed', 'error');
    } finally {
      setShowConfirmModal(false);
      setItemToDelete(null);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting changes
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
      <Notification 
        show={notification.show} 
        message={notification.message} 
        type={notification.type} 
      />

      <div className="flex justify-between items-center mb-4 mt-10">
        <h1 className="text-xl font-bold">Clasess Management</h1>
        <button 
          onClick={() => openModal()} 
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Classes
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                No
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => requestSort('name_class')}
              >
                <div className="flex items-center">
                  Class Name
                  <span className="ml-1">{getSortIcon('name_class')}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((item, index) => (
              <tr key={item.id_class}>
                <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.name_class}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button 
                    onClick={() => openModal(item)} 
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => openDeleteConfirm(item.id_class)} 
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
          Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} data
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Kelas' : 'Tambah Kelas'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text"
                value={nameClass}
                onChange={(e) => setNameClass(e.target.value)}
                placeholder="Nama Kelas"
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Simpan
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
        title="Konfirmasi Hapus"
        message="Do you reallyu want to delete this class?"
      />
    </div>
  );
};

export default Class;