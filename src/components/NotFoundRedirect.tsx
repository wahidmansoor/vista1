import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/handbook");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Redirecting to handbook...
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}