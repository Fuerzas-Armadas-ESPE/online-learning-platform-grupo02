import React, { useState, useEffect } from "react";
import { getCoursesFromFirestore } from "../api/coursesApi";

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
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Ordenar los cursos según el valor del filtro
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

  // Filtrar los cursos ordenados según la consulta de búsqueda
  const filteredCourses = sortedCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Courses</h1>

      <input
        type="text"
        placeholder="Buscar Cursos por el titulo o instructor"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />

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
        {filteredCourses.map((course) => (
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
