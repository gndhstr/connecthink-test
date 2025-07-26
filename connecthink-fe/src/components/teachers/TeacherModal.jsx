// components/teachers/TeacherModal.jsx
import { FaTimes } from 'react-icons/fa';

const TeacherModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  form, 
  onChange,
  isEditing
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        
        <h2 className="text-lg font-semibold mb-4">
          {isEditing ? 'Edit Teacher' : 'Add New Teacher'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={onChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIP
            </label>
            <input
              name="nip_teacher"
              type="text"
              value={form.nip_teacher}
              onChange={onChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class ID
            </label>
            <input
              name="id_class"
              type="text"
              value={form.id_class}
              onChange={onChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;