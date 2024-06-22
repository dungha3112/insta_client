import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextButton from "../common/TextButton";
import TextInput from "../common/TextInput";
import { updatePassword } from "../../redux/actions/profileAction";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const { auth } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    dispatch(updatePassword({ oldPassword, password }, auth));
  };

  useEffect(() => {
    if (!auth.access_token) navigate("/");
  }, [auth.access_token, navigate]);

  return (
    <div className="w-full p-5">
      <form
        onSubmit={handleUpdatePassword}
        className="w-full flex flex-col justify-center items-center"
      >
        <div className="w-full flex flex-col pt-2 gap-2 max-w-[300px] ">
          <div>
            <label className="font-bold" htmlFor="Old Password">
              Old Password
            </label>
            <TextInput
              type="password"
              id="Old Password"
              value={oldPassword}
              setValue={setOldPassword}
              placeholder="Old password ..."
            />
          </div>
          <div>
            <label className="font-bold" htmlFor="Password">
              Password
            </label>
            <TextInput
              type="password"
              id="Password"
              value={password}
              setValue={setPassword}
              placeholder="Password ..."
            />
          </div>
          <TextButton
            type="submit"
            disabled={auth.loading}
            title={auth.loading ? "Loading ..." : "Save"}
          />
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
