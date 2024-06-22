import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

const TextInput = ({ value, setValue, trim, className, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      <div className="relative flex flex-col">
        <input
          type={showPassword ? "text" : type}
          className="appearance-none border pr-10 bg-app-black border-gray-300 rounded-md py-2 px-4 leading-tight focus:outline-none focus:border-green-500 transition-colors duration-200 placeholder:text-sm"
          {...props}
          value={value}
          onChange={(e) =>
            setValue(
              trim
                ? e.target.value.toLowerCase().replace(/ /g, "")
                : e.target.value
            )
          }
        />
        {type === "password" && (
          <div className="absolute top-[50%] right-1 -translate-y-1/2 pr-2 flex items-center">
            <button
              type="button"
              // id="togglePassword"
              className="text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IoEye fontSize={20} />
              ) : (
                <IoEyeOff fontSize={20} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInput;
