import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Background from "../../components/common/auth/Background";
import OAuth from "../../components/OAuth";
import { useUser } from "../../contexts/UserContext";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const { setUserData } = useUser();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      setUserData(formData);
      // Gửi mã xác thực vào email ở đây
      navigate("/confirm-email");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };
  return (
    <div className="fixed w-full h-full">
      <Background />
      <div className="h-full w-full flex justify-center items-center relative z-10">
        <div className="z-10 py-5 px-10 md:px-20 md:py-10 m-5 shadow-2xl border max-w-2xl rounded-3xl gap-2">
          <h1 className="min-w-[400px] text-3xl text-center font-semibold mb-7">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              id="username"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />
            <p className="bg-slate-100 rounded-lg flex justify-end items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                className="bg-slate-100 p-3 rounded-lg flex-1"
                onChange={handleChange}
              />
              <span
                className="mx-2 hover:cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </span>
            </p>
            <button
              disabled={loading}
              className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5">
            <p>Have an account?</p>
            <Link to="/sign-in">
              <span className="text-blue-500">Sign in</span>
            </Link>
          </div>
          <p className="text-red-700 text-sm mt-1">
            {error && "Something went wrong!"}
          </p>
        </div>
      </div>
    </div>
  );
}
