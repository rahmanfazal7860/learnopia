import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto text-center mt-24 px-4">
      <h1 className="text-4xl font-bold text-gray-900">
        Learn without limits, on <span className="text-brand-600">Learnopia</span>
      </h1>
      <p className="text-gray-500 mt-4 text-lg">
        A full-stack learning platform for course creation, enrollment, and progress tracking.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/courses"
          className="bg-brand-600 text-white px-6 py-3 rounded-md hover:bg-brand-700"
        >
          Browse Courses
        </Link>
        {!user && (
          <Link
            to="/register"
            className="bg-white border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50"
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
}
