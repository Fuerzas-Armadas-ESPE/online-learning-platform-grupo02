import { useEffect, useState } from "react";
import { getCoursesFromFirestore } from "../api/coursesApi";

const Courses = () => {
  const [courses, setCourses] = useState([]);
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

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Ordenar los cursos según el valor del filtro
  const sortedCourses = [...courses].sort((a, b) => {
    if (filter === 'newest') {
      return b.create - a.create; // Para más reciente a más antiguo
    } else if (filter === 'oldest') {
      return a.create - b.create; // Para más antiguo a más reciente
    } else if (filter === 'titleAZ') {
      return a.title.localeCompare(b.title); // Para título de la A a la Z
    } else if (filter === 'titleZA') {
      return b.title.localeCompare(a.title); // Para título de la Z a la A
    } else if (filter === 'instructorAZ') {
      return a.instructor.localeCompare(b.instructor); // Para instructor de la A a la Z
    } else if (filter === 'instructorZA') {
      return b.instructor.localeCompare(a.instructor); // Para instructor de la Z a la A
    }
    return 0;
  });

  return (
    <div>
      <h1>Courses</h1>
      <select value={filter} onChange={handleFilterChange}>
        <option value="all">Todos</option>
        <option value="newest">Más reciente</option>
        <option value="oldest">Más antiguo</option>
        <option value="titleAZ">Título (A-Z)</option>
        <option value="titleZA">Título (Z-A)</option>
        <option value="instructorAZ">Instructor (A-Z)</option> {/* Opción para filtrar por instructor de la A a la Z */}
        <option value="instructorZA">Instructor (Z-A)</option> {/* Opción para filtrar por instructor de la Z a la A */}
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
