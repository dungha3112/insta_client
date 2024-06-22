import { useState } from "react";
import ChangePassword from "../components/profile/ChangePassword";
import EditProfile from "../components/profile/EditProfile";

const Setting = () => {
  const [selected, setSelected] = useState("edit-profile");

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-3 p-3 fixed top-0 w-[150px]  min-h-full border-r">
        <h1 className="text-2xl font-bold">Settings</h1>
        <span
          className={`cursor-pointer px-2 py-1 rounded-md ${
            selected === "edit-profile" ? "bg-[#c0c0c0]" : ""
          } hover:bg-[#c0c0c0]`}
          onClick={() => setSelected("edit-profile")}
        >
          Edit profile
        </span>
        <span
          className={`cursor-pointer px-2 py-1 rounded-md ${
            selected === "change-password" ? "bg-[#c0c0c0]" : ""
          } hover:bg-[#c0c0c0]`}
          onClick={() => setSelected("change-password")}
        >
          Password
        </span>
      </div>
      <div className="w-full ml-[150px]">
        {selected === "edit-profile" && <EditProfile />}
        {selected === "change-password" && <ChangePassword />}
      </div>
    </div>
  );
};

export default Setting;
