import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-brand-600">
        Learnopia
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link to="/courses" className="text-gray-600 hover:text-brand-600">
          Courses
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-brand-600">
              Dashboard
            </Link>
            <span className="text-gray-400">
              {user.name} · <span className="capitalize">{user.role}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-brand-600">
              Log in
            </Link>
            <Link
              to="/register"
              className="bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
