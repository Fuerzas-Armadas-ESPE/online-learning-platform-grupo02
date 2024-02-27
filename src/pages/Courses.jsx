import React, { useState, useEffect } from "react";
import { getCoursesFromFirestore } from "../api/coursesApi"; // Importa la función para obtener los cursos desde Firestore

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesData = await getCoursesFromFirestore();
      const formattedCourses = coursesData.map((course) => ({
        ...course,
        create: course.create.toDate(),
      }));
      setCourses(formattedCourses);
    };

    fetchCourses();
  }, []);
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Courses</h1>
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar Cursos por el titulo o instructor"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <ul>
        {filteredCourses.map((course) => (
          <li key={course.id}>
            <h2>{course.title}</h2>
            <p style={{ textAlign: "justify" }}>{course.description}</p>
            <p>Instructor: {course.instructor}</p>
            <p>Created: {new Date(course.create).toLocaleString()}</p>
            <p>
              URL: <a href={course.url}>{course.url}</a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;


