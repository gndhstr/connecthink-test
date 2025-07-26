import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/teacher';

export const teacherService = {
  getTeachersWithClasses: async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/teachers-with-classes');
      return response.data;
    } catch (error) {
      console.error('Error fetching teachers with classes:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher:', error);
      throw error;
    }
  },

  create: async (teacherData) => {
    try {
      const response = await axios.post(API_URL, teacherData);
      return response.data;
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  },

  update: async (id, teacherData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, teacherData);
      return response.data;
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  }
};