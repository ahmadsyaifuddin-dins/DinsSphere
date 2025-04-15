import { useNavigate } from "react-router-dom";

const AuthOverlay = ({ isAdmin }) => {
  const navigate = useNavigate();

  if (isAdmin) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20 bg-black/5 backdrop-blur-xs backdrop-brightness-75">
      <div className="bg-slate-950 p-5 rounded-xl shadow-2xl text-center max-w-md w-full border border-yellow-500 transform transition-all animate-fadeIn">
        <div className="mb-4">
          <div className="h-20 w-20 mx-auto rounded-full bg-yellow-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-red-700">
          Restricted Access ✋
        </h2>
        <p className="mb-2 text-white">
          Hai! Terima kasih sudah mengunjungi halaman ini.
        </p>
        <p className="mb-6 text-white">
          Halaman ini dikhususkan untuk pengguna yang telah terdaftar di sistem DinsSphere.
        </p>
        <button
          className="cursor-pointer w-full bg-blue-950 text-white py-3 px-6 rounded-lg hover:bg-slate-950 transition-all transform hover:scale-105 font-medium shadow-md"
          onClick={() => navigate("/login")}
        >
          Masuk Sekarang
        </button>
        <p className="mt-4 text-xs text-white">
          Silakan masuk untuk mengakses konten khusus ini.
        </p>
      </div>
    </div>
  );
};

export default AuthOverlay;