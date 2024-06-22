import { useState } from "react";
import { TbLock } from "react-icons/tb";
import { Link } from "react-router-dom";
import TextButton from "../components/common/TextButton";
import TextInput from "../components/common/TextInput";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="w-full border p-3 max-w-[350px] fixed flex flex-col gap-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <form className="">
        <div className="w-fit mx-auto flex p-3 border rounded-full">
          <TbLock fontSize={50} />
        </div>
        <p className="text-center text-lg font-semibold">Trouble logging in?</p>
        <p className="text-center text-sm font-thin pb-3">
          Enter your email, phone, or username and we'll send you a link to get
          back into your account.
        </p>

        <TextInput
          value={email}
          setValue={setEmail}
          required
          type="email"
          placeholder="Email ..."
        />
        <TextButton title="Submit" />

        <div className="flex items-center gap-5 pt-4">
          <div className="border-b w-[80%]" />
          OR
          <div className="border-b w-[80%]" />
        </div>

        <p className="text-sm text-center pt-4">
          <Link to="/signup" className="hover:text-red-500 transition">
            Create new account
          </Link>
        </p>
      </form>
      <Link to="/" className="">
        <p className="text-sm text-center border-t p-4 bg-gray-200">
          Back to login
        </p>
      </Link>
    </div>
  );
};

export default ForgotPassword;
