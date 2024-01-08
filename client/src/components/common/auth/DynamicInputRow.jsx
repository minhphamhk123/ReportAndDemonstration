import React, { useEffect, useRef, useState } from "react";

const DynamicInputRow = ({ className, onResultChange }) => {
  const [inputValues, setInputValues] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleInputChange = (index, value) => {
    if (/^\d{0,1}$/.test(value)) {
      const newInputValues = [...inputValues];
      newInputValues[index] = value;
      setInputValues(newInputValues);

      // Tự động focus vào ô tiếp theo nếu không phải ô cuối cùng
      if (index < inputRefs.length - 1 && value !== "") {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      // Nếu có số trong ô hiện tại, xóa số
      if (inputValues[index] !== "") {
        const newInputValues = [...inputValues];
        newInputValues[index] = "";
        setInputValues(newInputValues);
      } else {
        // Nếu không có số, di chuyển focus đến ô trước đó (nếu có)
        if (index > 0) {
          inputRefs[index - 1].current.focus();
        }
      }
    }
  };

  const getResultNumber = () => {
    const resultString = inputValues.join("");
    return parseInt(resultString, 10);
  };

  useEffect(() => {
    onResultChange(getResultNumber());
  }, [inputValues]);

  return (
    <div className={`${className}`}>
      {inputValues.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          maxLength="1"
          onKeyDown={(e) => handleKeyDown(index, e)}
          onChange={(e) => handleInputChange(index, e.target.value)}
          ref={inputRefs[index]}
          className="border border-emerald-300 outline-none rounded-lg text-5xl text-center w-14 h-14 text-gray-900 inline-block mx-4"
        />
      ))}
    </div>
  );
};

export default DynamicInputRow;
