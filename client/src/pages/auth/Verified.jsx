import React from "react";
import Background from "../../components/common/auth/Background";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUser } from "../../contexts/UserContext";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { message } from "antd";

export default function Verified() {
  const { userData, setUserData } = useUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const showError = (message) => {
    messageApi.open({
      key: "error",
      type: "error",
      content: message,
    });
  };
  const handleContinue = async () => {
    try {
      dispatch(signInStart());
      const res = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        showError("Xảy ra lỗi trong quá trình đăng nhập!");
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
      // setUserData(null);
    } catch (error) {
      dispatch(signInFailure(error));
      console.error(error);
      showError("Có lỗi trong quá trình xử lý! Vui lòng thử lại.");
    }
  };

  return (
    <div className="z-0 fixed w-full h-full">
      {contextHolder}
      <Background />
      <div className="h-full flex justify-center items-start relative z-10">
        <div className="flex flex-col items-center gap-5 mt-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-14 h-14 md:w-20 md:h-20 p-2 md:p-3 rounded-xl shadow-2xl border text-emerald-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="text-center align-center text-2xl md:text-3xl font-bold ">
            Email verified
          </p>
          <p className="text-center font-semibold">
            <p className="block">Your email has been successfully verify.</p>
            <p className="block">Click bellow to go to Home page</p>
          </p>
          <button
            className="bg-emerald-400 text-white p-3 rounded-2xl uppercase hover:opacity-90 px-10 font-semibold"
            onClick={handleContinue}
          >
            Continue
          </button>
          <Link to="/sign-in">
            <p className="gap-2 flex justify-center items-center text-center text-gray-500 hover:font-semibold cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 inline-block font-bold"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              <text className="inline-block">Back to login</text>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
