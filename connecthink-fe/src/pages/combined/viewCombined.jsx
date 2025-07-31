import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Notification from "@/components/ui/Notification";

const ViewStudentTeacher = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const fetchStudents = async () => {
    try {
      const params = { page: currentPage, per_page: itemsPerPage };
      const res = await axios.get("http://127.0.0.1:8000/api/students", {
        params,
      });
      const rawData = res.data.data || res.data;

      const sorted = [...rawData].sort((a, b) => {
        const key = sortConfig.key;
        if (!key) return 0;
        if (typeof a[key] === "string") {
          return sortConfig.direction === "asc"
            ? a[key].localeCompare(b[key])
            : b[key].localeCompare(a[key]);
        } else {
          return sortConfig.direction === "asc"
            ? a[key] - b[key]
            : b[key] - a[key];
        }
      });

      setStudents(sorted);
      setTotalItems(res.data.total || res.data.length);
    } catch {
      showNotification("Failed to load students", "error");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/class");
      setClasses(res.data);
    } catch {
      showNotification("Failed to load classes", "error");
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/teacher");
      setTeachers(res.data);
    } catch {
      showNotification("Failed to load teachers", "error");
    }
  };

  const getClassName = (idClass) => {
    const kelas = classes.find((k) => k.id_class === idClass);
    return kelas ? kelas.name_class : "-";
  };

  const getTeacherName = (idClass) => {
    const guru = teachers.find((t) => t.class_relation?.id_class === idClass);
    return guru ? guru.name : "-";
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification((prev) => ({ ...prev, show: false })),
      3000
    );
  };

  const requestSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchTeachers();
  }, [currentPage, sortConfig]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="container">
      <Notification {...notification} />
      <h2 className="text-2xl font-bold mb-4 mt-10">
        Students, Classes, and Teachers
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">No</th>
              <th
                className="border px-4 py-2 cursor-pointer"
                onClick={() => requestSort("name_class")}
              >
                <div className="flex items-center justify-between">
                  Classes {getSortIcon("name_class")}
                </div>
              </th>
              <th className="border px-4 py-2">Teacher</th>
              <th
                className="border px-4 py-2 cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center justify-between">
                  Students Name {getSortIcon("name")}
                </div>
              </th>
              <th
                className="border px-4 py-2 cursor-pointer"
                onClick={() => requestSort("nis_student")}
              >
                <div className="flex items-center justify-between">
                  NIS {getSortIcon("nis_student")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              students.reduce((acc, student) => {
                const classId = student.id_class;
                if (!acc[classId]) acc[classId] = [];
                acc[classId].push(student);
                return acc;
              }, {})
            ).map(([classId, studentGroup]) => {
              const className = getClassName(Number(classId));
              const teacherName = getTeacherName(Number(classId));

              return studentGroup.map((student, idx) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="border px-4 py-2">
                    {idx === 0 ? className : ""}
                  </td>
                  <td className="border px-4 py-2">
                    {idx === 0 ? teacherName : ""}
                  </td>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.nis_student}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          students
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-200"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Previous
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-200"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentTeacher;
