import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadIcon from "../../assets/images/loading.gif";
import { MESSAGE_TYPES } from "../../redux/reducers/messageReducer";
import { getDataAPI } from "../../utils/fetchData";
import TextInput from "../common/TextInput";
import UserCard from "../common/UserCard";

const SearchUser = ({ setIsModalSearch }) => {
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { auth, online } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddUser = (user) => {
    dispatch({
      type: MESSAGE_TYPES.ADD_USER,
      payload: { ...user, text: "", media: [] },
    });
    dispatch({ type: MESSAGE_TYPES.CHECK_ONLINE_OFFLINE, payload: online });

    setIsModalSearch(false);
    return navigate(`/message/${user._id}`);
  };
  console.log({ online });

  useEffect(() => {
    const handleSearchUser = async () => {
      setLoading(true);
      try {
        const res = await getDataAPI(
          `user/search?username=${search}`,
          auth.access_token
        );
        setSearchUsers(res.data.users);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    if (search) {
      handleSearchUser();
    } else {
      setSearchUsers([]);
    }
  }, [auth.access_token, search]);

  return (
    <div className="fixed z-[99999999] inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg w-[400px] h-[400px] p-3 relative">
        <div className="flex items-center gap-2 justify-between">
          <h1 className="text-xl font-bold">New message</h1>
          <IoMdCloseCircle
            fontSize={28}
            className="cursor-pointer hover:text-red-500"
            onClick={() => setIsModalSearch(false)}
          />
        </div>

        <div className="py-2">
          <TextInput
            value={search.toLowerCase().replace(/ /g, "")}
            trim={true}
            setValue={setSearch}
            type="text"
            placeholder="Search..."
          />
        </div>
        <div className="h-[250px] overflow-auto">
          {loading && (
            <img src={LoadIcon} alt="LoadIcon" className="w-4 block mx-auto" />
          )}

          {searchUsers.length !== 0 ? (
            searchUsers.map((user) => (
              <div
                key={user._id}
                className="cursor-pointer bg-white px-4 py-2 hover:bg-gray-100"
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} />
              </div>
            ))
          ) : (
            <small>No account found.</small>
          )}
        </div>

        {/* <div className="absolute bottom-3 left-3 right-3">
          <TextButton title="Chat" />
        </div> */}
      </div>
    </div>
  );
};

export default SearchUser;
