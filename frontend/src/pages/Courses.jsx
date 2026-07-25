import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Courses() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await api("/api/courses");
      setCourses(data.courses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api("/api/courses", { method: "POST", body: form, token });
      setForm({ title: "", description: "" });
      setShowForm(false);
      loadCourses();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEnroll = async (courseId) => {
    setError("");
    try {
      await api("/api/enrollments", { method: "POST", body: { course_id: courseId }, token });
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Browse Courses</h1>
        {user?.role === "instructor" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 text-sm"
          >
            {showForm ? "Cancel" : "+ New Course"}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-md mb-4">{error}</div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm space-y-3"
        >
          <input
            required
            placeholder="Course title"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create course"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses yet. Check back soon.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <Link
                  to={`/courses/${course.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-brand-600"
                >
                  {course.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  By {course.instructor_name} · {course.enrolled_count} enrolled
                </p>
              </div>
              {user?.role === "student" && (
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="mt-4 bg-brand-50 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded-md text-sm self-start"
                >
                  Enroll
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
