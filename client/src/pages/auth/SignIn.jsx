import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import styles from "../../styles/SignIn.module.css";
import Background from "../../components/common/auth/Background";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [showError, setShowError] = useState(false);
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        setShowError(true);
        return;
      }
      dispatch(signInSuccess(data.user));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="z-0 fixed w-full h-full">
      <Background />
      <div className="h-full flex justify-center items-center relative z-10">
        <div
          className={`${styles.main_page} py-5 px-10 md:px-20 md:py-10 min-w-[100px] sm:min-w-[400px] shadow-2xl border max-w-2xl rounded-3xl `}
        >
          <h1 className={`${styles.header} min-w-[100px] sm:min-w-[400px]`}>
            Sign In
          </h1>
          <form onSubmit={handleSubmit} className={`${styles.form} gap-4`}>
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
            <button disabled={loading} className={styles.button}>
              {loading ? "Loading..." : "Sign In"}
            </button>
            <OAuth />
          </form>
          <div className={styles.container}>
            <p>Dont Have an account?</p>
            <Link to="/sign-up">
              <span className={styles.blue_span}>Sign up</span>
            </Link>
          </div>
          <p className={`${styles.p_show_error} text-sm`}>
            {error && showError ? error.message || "Something went wrong!" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
