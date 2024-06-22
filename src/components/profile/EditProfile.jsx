import React, { useEffect, useState } from "react";
import { IoIosCamera } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import TextButton from "../common/TextButton";
import TextInput from "../common/TextInput";
import { updateProfile } from "../../redux/actions/profileAction";

const EditProfile = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState(null);

  const [fullname, setFullname] = useState(auth.user.fullname);
  const [username, setUsername] = useState(auth.user.username);
  const [bio, setBio] = useState(auth.user.bio);
  const [website, setWebsite] = useState(auth.user.website);
  const [gender, setGender] = useState(auth.user.gender);

  const handleChangeAvatar = (e) => {
    const target = e.target;
    const files = target.files;

    if (files) {
      const file = files[0];
      setAvatar({ image: URL.createObjectURL(file), file: file });
    }
  };

  useEffect(() => {
    if (auth.user) {
      setFullname(auth.user.fullname);
      setUsername(auth.user.username);
      setBio(auth.user.bio);
      setWebsite(auth.user.website);
      setGender(auth.user.gender);
    }
  }, [auth.user]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const data = {
      fullname,
      bio,
      website,
      gender,
      username,
    };

    dispatch(updateProfile({ data, avatar, auth }));
  };

  return (
    <div className="w-full p-5">
      <form
        onSubmit={handleUpdateProfile}
        className="w-full flex flex-col justify-center items-center"
      >
        <div className="info_avatar">
          <img src={avatar ? avatar.image : auth.user.avatar} alt="avatar" />
          <span>
            <IoIosCamera className="w-full text-center" fontSize={20} />
            <p>Change</p>
            <input
              type="file"
              name="file"
              id="file_up"
              accept="image/*"
              className="absolute top-0 left-0 w-full h-full cursor-pointer opacity-0"
              onChange={handleChangeAvatar}
            />
          </span>
        </div>

        <div className="w-full flex flex-col pt-2 gap-2 max-w-[300px] ">
          <div>
            <label className="font-bold" htmlFor="Username">
              Username
            </label>
            <TextInput
              id="Username"
              value={username.toLowerCase().replace(/ /g, "")}
              setValue={setUsername}
              placeholder="Username ..."
            />
          </div>
          <div>
            <label className="font-bold" htmlFor="Fullname">
              Fullname
            </label>
            <TextInput
              id="Fullname"
              value={fullname}
              setValue={setFullname}
              placeholder="Fullname ..."
            />
          </div>
          <div>
            <label className="font-bold" htmlFor="Bio">
              Bio
            </label>
            <TextInput
              value={bio}
              setValue={setBio}
              placeholder="Bio ..."
              maxLength={150}
              min={150}
            />
            <span className="block text-right text-xs">{bio.length} / 150</span>
          </div>
          <div>
            <label className="font-bold" htmlFor="Website">
              Website
            </label>
            <TextInput
              id="Website"
              value={website}
              setValue={setWebsite}
              placeholder="Website ..."
            />
          </div>

          <div>
            <label htmlFor="Gender" className="font-bold">
              Gender
            </label>
            <div className="px-0 mb-4">
              <select
                name="Gender"
                id="Gender"
                className="w-full max-w-[300px] appearance-none border pr-10 bg-app-black border-gray-300 rounded-md py-2 px-4 leading-tight focus:outline-none focus:border-green-500 transition-colors duration-200 placeholder:text-sm"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <TextButton
              type="submit"
              disabled={auth.loading}
              title={auth.loading ? "Loading ..." : "Save"}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
