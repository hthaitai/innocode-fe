import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
     <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
      <p className="text-gray-600 mb-8">You do not have permission to view this page.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Return to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
