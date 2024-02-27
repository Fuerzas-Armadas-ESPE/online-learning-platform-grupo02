
import React, { useState, useEffect } from "react";
import { getCoursesFromFirestore } from "../api/coursesApi"; // Importa la función para obtener los cursos desde Firestore

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState('all');

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


  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (filter === 'newest') {
      return b.create - a.create; 
    } else if (filter === 'oldest') {
      return a.create - b.create; 
    } else if (filter === 'titleAZ') {
      return a.title.localeCompare(b.title); 
    } else if (filter === 'titleZA') {
      return b.title.localeCompare(a.title);
    } else if (filter === 'instructorAZ') {
      return a.instructor.localeCompare(b.instructor);
    } else if (filter === 'instructorZA') {
      return b.instructor.localeCompare(a.instructor); 
    }
    return 0;
  });

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

      <select value={filter} onChange={handleFilterChange}>
        <option value="all">Todos</option>
        <option value="newest">Más reciente</option>
        <option value="oldest">Más antiguo</option>
        <option value="titleAZ">Título (A-Z)</option>
        <option value="titleZA">Título (Z-A)</option>
        <option value="instructorAZ">Instructor (A-Z)</option>
        <option value="instructorZA">Instructor (Z-A)</option> 
      </select>
      <ul>
        {sortedCourses.map((course) => (
          <li key={course.id}>
            <h2>{course.title}</h2>
            <p style={{ textAlign: "justify" }}>
              Description: {course.description}
            </p>

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


