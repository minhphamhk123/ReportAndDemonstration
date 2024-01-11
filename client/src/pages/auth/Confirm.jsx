/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Background from "../../components/common/auth/Background";
import LetterIcon from "../../assets/images/letter_icon.png";
import { Link, useNavigate } from "react-router-dom";
import DynamicInputRow from "../../components/common/auth/DynamicInputRow";
import { useUser } from "../../contexts/UserContext";
import EmailVerify from "../../components/common/EmailVerify";
import { message } from "antd";

export default function Confirm() {
  const { userData } = useUser();
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [currentResendTimeout, setCurrentResendTimeout] = useState(0);
  const [codeGenerated, setCodeGenerated] = useState(0);
  const [resultNumber, setResultNumber] = useState(null); //Giá trị người dùng nhập vào
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const error = () => {
    messageApi.open({
      type: "error",
      content:
        resultNumber.toString().length === 4
          ? "Mã xác thực không đúng"
          : "Vui lòng nhập mã xác thực!",
    });
  };
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Đã gửi lại mã xác thực. Vui lòng kiểm tra email!",
    });
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: `Bạn có thể gửi lại mã sau ${currentResendTimeout}s`,
    });
  };

  const handleVerifySuccess = () => {
    // Update lại giá trị verified của user

    navigate("/verified");
  };

  const handleSetTimeout = () => {
    setResendTimeout(30);
    const timer = setInterval(() => {
      setResendTimeout((prevResendTimeout) => {
        if (prevResendTimeout === 0) {
          clearInterval(timer);
          return 0;
        }
        return prevResendTimeout - 1;
      });
    }, 1000);
  };

  const handleVerify = () => {
    // Thực hiện hàm xử lý so sánh mã xác nhận
    codeGenerated === resultNumber ? handleVerifySuccess() : error();
  };

  const handleResend = () => {
    setCurrentResendTimeout(resendTimeout);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currentResendTimeout === 0) {
        try {
          // Viết câu lệnh gửi mã xác thực vào email ở đây
          const code = await EmailVerify({ email: userData.email });
          setCodeGenerated(code);
          handleSetTimeout();
          isFirstTime ? setIsFirstTime(false) : success();
        } catch (error) {
          console.error("Lỗi quá trình gửi mã xác thực:", error);
        }
      } else {
        warning();
      }
    };
    fetchData();
  }, [currentResendTimeout]);

  return (
    <div className="fixed w-full h-full overflow-auto">
      {contextHolder}
      <Background />
      <div className="h-full flex justify-center items-start relative z-10">
        <div className="flex flex-col items-center gap-5 mt-20">
          <img
            className="w-14 h-14 md:w-20 md:h-20 rounded-xl shadow-2xl border"
            src={LetterIcon}
            alt="letter_icon"
          />
          <p className="text-center align-center text-2xl md:text-3xl font-bold ">
            Check your email
          </p>
          <p className="text-center font-semibold">
            <p className="block">We sent a verication link to</p>
            <p className="block">{userData.email}</p>
          </p>

          <DynamicInputRow
            className="flex my-4"
            onResultChange={setResultNumber}
          />

          <button
            className="bg-emerald-400 text-white p-3 rounded-2xl uppercase hover:opacity-90 px-10 font-semibold"
            onClick={handleVerify}
          >
            Verify
          </button>
          <p className="text-center">
            <p className="inline-block">
              Didn’t receive the email?{" "}
              <p
                className="font-medium text-black hover:underline hover:cursor-pointer hover:italic inline-block"
                onClick={handleResend}
              >
                Click to resend
              </p>
            </p>
          </p>
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
              <p className="inline-block">Back to login</p>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
