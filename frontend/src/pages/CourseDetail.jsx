import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/courses/${id}`)
      .then(setCourse)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!course) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Link to="/courses" className="text-sm text-brand-600">
        ← Back to courses
      </Link>
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mt-4">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-gray-600 mt-3">{course.description || "No description provided."}</p>
        <div className="flex gap-6 text-sm text-gray-400 mt-5 border-t pt-4">
          <span>Instructor: {course.instructor_name}</span>
          <span>{course.enrolled_count} students enrolled</span>
        </div>
      </div>
    </div>
  );
}
