import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown, FaTimes } from 'react-icons/fa';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Notification from '@/components/ui/Notification';

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: '', nip_teacher: '', id_class: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ''
  });
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [filteredTeachers, setFilteredTeachers] = useState([]);

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

  const applyClassFilter = () => {
    if (selectedClassFilter === 'all') {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(teacher => 
        teacher.class_relation?.class_detail?.id_class === parseInt(selectedClassFilter)
      );
      setFilteredTeachers(filtered);
    }
  };

  useEffect(() => {
    applyClassFilter();
  }, [teachers, selectedClassFilter]);

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

  const openModal = (teacher = null) => {
    if (teacher) {
      setForm({ 
        name: teacher.name, 
        nip_teacher: teacher.nip_teacher, 
        id_class: teacher.id_class 
      });
      setEditingId(teacher.id_teacher);
    } else {
      setForm({ name: '', nip_teacher: '', id_class: '' });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/teacher/${editingId}`, form);
        showNotification('Data Teacher berhasil diperbarui', 'success');
      } else {
        await axios.post('http://127.0.0.1:8000/api/teacher', form);
        showNotification('Data Teacher berhasil ditambahkan', 'success');
      }
      fetchTeachers();
      closeModal();
    } catch (err) {
      console.error('Error saving data', err);
      showNotification('Gagal menyimpan data Teacher', 'error');
    }
  };

  const openDeleteConfirm = (id) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/teacher/${itemToDelete}`);
      showNotification('Data Teacher successfuly deleted', 'success');
      fetchTeachers();
    } catch (err) {
      console.error('Error deleting data', err);
      showNotification('Delete data teacher failed', 'error');
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
        <h1 className="text-xl font-bold">Teacher Management</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm border">
            <select
              value={selectedClassFilter}
              onChange={(e) => {
                setSelectedClassFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border-none focus:ring-0 focus:outline-none text-sm"
            >
              <option value="all">All Clasess</option>
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
            <FaPlus /> Add Teacher
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id_teacher}>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.nip_teacher}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.class_relation?.class_detail?.name_class || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button 
                    onClick={() => openModal(teacher)} 
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => openDeleteConfirm(teacher.id_teacher)} 
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

      {/* Form Modal */}
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
              {editingId ? 'Edit Teacher' : 'Tambah Teacher'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                name="name" 
                type="text" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Name" 
                className="w-full border p-2 rounded" 
                required 
              />
              <input 
                name="nip_teacher" 
                type="text" 
                value={form.nip_teacher} 
                onChange={handleChange} 
                placeholder="NIP" 
                className="w-full border p-2 rounded" 
                required 
              />
              <select 
                name="id_class" 
                value={form.id_class} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                required
              >
                <option value="">Pilih Kelas</option>
                {classes.map((cls) => (
                  <option key={cls.id_class} value={cls.id_class}>
                    {cls.name_class}
                  </option>
                ))}
              </select>
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
        message="Apakah Anda yakin ingin menghapus data Teacher ini?"
      />
    </div>
  );
};

export default Teacher;