import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "student") {
      setLoading(false);
      return;
    }
    api("/api/enrollments/me", { token })
      .then(setEnrollments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, token]);

  const updateProgress = async (enrollmentId, percent) => {
    try {
      await api(`/api/enrollments/${enrollmentId}/progress`, {
        method: "PATCH",
        body: { percent_complete: percent },
        token,
      });
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollmentId ? { ...e, percent_complete: percent } : e))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name}</h1>
      <p className="text-gray-500 mb-6 capitalize">{user?.role} dashboard</p>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-md mb-4">{error}</div>
      )}

      {user?.role === "instructor" ? (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <p className="text-gray-600">
            Head to <span className="font-medium">Courses</span> to create and manage your
            courses.
          </p>
        </div>
      ) : loading ? (
        <p className="text-gray-500">Loading your courses...</p>
      ) : enrollments.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <p className="text-gray-600">
            You haven't enrolled in any courses yet. Browse the course catalog to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((e) => (
            <div key={e.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{e.course_title}</h3>
                <span className="text-sm text-gray-500">{e.percent_complete}% complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div
                  className="bg-brand-600 h-2 rounded-full transition-all"
                  style={{ width: `${e.percent_complete}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={e.percent_complete}
                onChange={(ev) => updateProgress(e.id, Number(ev.target.value))}
                className="w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
