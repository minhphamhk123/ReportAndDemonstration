import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Background from "../../components/common/auth/Background";
import OAuth from "../../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
      navigate("/sign-in");
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
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />
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
